from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import tempfile
import shutil
from pathlib import Path
import uvicorn

# Import StudyMate functionality
from studymate_backend import StudyMateBackend

app = FastAPI(title="StudyMate API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://127.0.0.1:8080", "http://10.201.4.160:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize StudyMate backend
studymate = StudyMateBackend()

class ChatMessage(BaseModel):
    message: str
    chat_history: Optional[List[dict]] = []

class ChatResponse(BaseModel):
    response: str
    sources: Optional[List[str]] = []

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    """Upload and process a PDF file"""
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    try:
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            shutil.copyfileobj(file.file, tmp_file)
            tmp_path = tmp_file.name
        
        # Process the PDF with StudyMate
        success = studymate.process_pdf(tmp_path)
        
        # Clean up temporary file
        os.unlink(tmp_path)
        
        if success:
            return {"message": f"PDF '{file.filename}' processed successfully", "filename": file.filename}
        else:
            raise HTTPException(status_code=500, detail="Failed to process PDF")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

@app.post("/chat", response_model=ChatResponse)
async def chat(message: ChatMessage):
    """Send a chat message and get response"""
    try:
        response = studymate.get_response(message.message)
        return ChatResponse(response=response, sources=[])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")

@app.post("/reset-conversation")
async def reset_conversation():
    """Reset the conversation memory"""
    try:
        studymate.reset_conversation()
        return {"message": "Conversation reset successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error resetting conversation: {str(e)}")

@app.get("/status")
async def get_status():
    """Get the current status of the backend"""
    try:
        status = studymate.get_status()
        return status
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting status: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message": "StudyMate API is running"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
