import os
import tempfile
from pathlib import Path
from typing import Optional, List
import logging

# LangChain imports
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.prompts import PromptTemplate
from langchain_together import Together
from langchain.memory import ConversationBufferWindowMemory
from langchain.chains import ConversationalRetrievalChain
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter

class StudyMateBackend:
    def __init__(self):
        self.qa_chain = None
        self.db = None
        self.is_initialized = False
        
        # Set up TogetherAI API key
        os.environ["TOGETHER_AI"] = "82c824338849b7f47a5b198e0a8305f0674fa771648b8e9d99cf736612cfb292"
        self.together_api_key = os.environ["TOGETHER_AI"]
        
        # Initialize embeddings
        self.embeddings = HuggingFaceEmbeddings(
            model_name="nomic-ai/nomic-embed-text-v1",
            model_kwargs={"trust_remote_code": True, "revision": "289f532e14dbbbd5a04753fa58739e9ba766f3c7"}
        )
        
        # Initialize memory
        self.memory = ConversationBufferWindowMemory(k=2, memory_key="chat_history", return_messages=True)
        
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)

    def process_pdf(self, pdf_path: str) -> bool:
        """Process a PDF file and create the vector database"""
        try:
            self.logger.info(f"Processing PDF: {pdf_path}")
            
            # Read PDF
            reader = PdfReader(pdf_path)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            
            if not text.strip():
                self.logger.error("No text extracted from PDF")
                return False
            
            # Split text into chunks
            text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
            chunks = text_splitter.split_text(text)
            
            self.logger.info(f"Created {len(chunks)} text chunks")
            
            # Create vector database
            self.db = FAISS.from_texts(chunks, self.embeddings)
            
            # Create retriever
            db_retriever = self.db.as_retriever(search_type="similarity", search_kwargs={"k": 4})
            
            # Define prompt template
            prompt_template = """<s>[INST]This is a chat template. As a legal chatbot specializing in Indian Penal Code queries, """
            """your primary objective is to provide accurate and concise information based on the user's questions. """
            """Do not generate your own questions and answers. Adhere strictly to the instructions provided, """
            """offering relevant context from the knowledge base while avoiding unnecessary details. """
            """Your responses will be brief, professional, and contextually relevant. """
            """CONTEXT: {context}\nCHAT HISTORY: {chat_history}\nQUESTION: {question}\nANSWER: </s>[INST] """
            
            prompt = PromptTemplate(
                template=prompt_template,
                input_variables=['context', 'question', 'chat_history']
            )
            
            # Initialize LLM
            llm = Together(
                model="mistralai/Mistral-7B-Instruct-v0.2",
                temperature=0.5,
                max_tokens=1024,
                together_api_key=self.together_api_key
            )
            
            # Create conversational retrieval chain
            self.qa_chain = ConversationalRetrievalChain.from_llm(
                llm=llm,
                memory=self.memory,
                retriever=db_retriever,
                return_source_documents=False,
                combine_docs_chain_kwargs={'document_variable_name': 'context'},
                output_key="answer"
            )
            
            self.is_initialized = True
            self.logger.info("PDF processed successfully and QA chain initialized")
            return True
            
        except Exception as e:
            self.logger.error(f"Error processing PDF: {str(e)}")
            return False

    def get_response(self, user_input: str) -> str:
        """Get response from the QA chain"""
        if not self.is_initialized or self.qa_chain is None:
            return "Please upload a PDF document first to initialize the chatbot."
        
        try:
            result = self.qa_chain.invoke({"question": user_input, "chat_history": []})
            return result["answer"]
        except Exception as e:
            self.logger.error(f"Error generating response: {str(e)}")
            return f"Sorry, I encountered an error: {str(e)}"

    def reset_conversation(self):
        """Reset the conversation memory"""
        if self.memory:
            self.memory.clear()
        self.logger.info("Conversation memory cleared")

    def get_status(self) -> dict:
        """Get the current status of the backend"""
        return {
            "initialized": self.is_initialized,
            "has_database": self.db is not None,
            "has_qa_chain": self.qa_chain is not None
        }
