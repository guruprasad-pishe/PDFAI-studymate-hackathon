# StudyMate - PDF Chat Interface

This is an integrated system that combines a modern React frontend with a StudyMate backend that can process PDF documents and answer questions about them using AI.

## Features

- 📄 PDF upload and processing
- 🤖 AI-powered question answering using StudyMate
- 💬 Real-time chat interface
- 🎨 Modern, responsive UI with shadcn/ui components
- 🔄 Conversation memory and reset functionality
- 🎤 Voice input support
- 🌐 Multi-language support

## Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm or yarn

## Quick Start

### 1. Start the Backend Server

First, navigate to the backend directory and start the StudyMate backend:

```bash
cd backend
python run_backend.py
```

This will:
- Install all required Python dependencies
- Start the FastAPI server on `http://localhost:8000`

### 2. Start the Frontend

In a new terminal, navigate to the project root and start the frontend:

```bash
npm install
npm run dev
```

This will start the React development server on `http://localhost:8080`

### 3. Use the Application

1. Open your browser and go to `http://localhost:8080`
2. Upload a PDF document using the file upload interface
3. Wait for the PDF to be processed (you'll see a success message)
4. Start asking questions about the document content

## API Endpoints

The backend provides the following endpoints:

- `POST /upload-pdf` - Upload and process a PDF file
- `POST /chat` - Send a message and get AI response
- `POST /reset-conversation` - Reset conversation memory
- `GET /health` - Health check
- `GET /status` - Get backend status

## Architecture

### Frontend (React + TypeScript)
- **Components**: Modern UI components using shadcn/ui
- **Context**: ChatContext for state management
- **Services**: chatService for API communication
- **Features**: File upload, chat interface, voice input

### Backend (FastAPI + Python)
- **StudyMate Integration**: LangChain-based PDF processing and QA
- **Vector Database**: FAISS for document embeddings
- **AI Model**: TogetherAI Mistral-7B-Instruct for responses
- **Memory**: Conversation buffer for context

## Configuration

### API Keys
The backend uses TogetherAI for the language model. The API key is configured in `backend/studymate_backend.py`.

### CORS
The backend is configured to allow requests from the frontend development server. Update the CORS settings in `backend/main.py` if needed.

## Troubleshooting

### Backend Issues
- Ensure Python dependencies are installed: `pip install -r backend/requirements.txt`
- Check that the TogetherAI API key is valid
- Verify the backend is running on port 8000

### Frontend Issues
- Ensure Node.js dependencies are installed: `npm install`
- Check that the backend URL is correct in `src/services/chatService.ts`
- Verify the frontend is running on port 8080

### PDF Processing Issues
- Ensure the PDF file is not corrupted
- Check that the PDF contains extractable text
- Verify the file size is under 10MB

## Development

### Adding New Features
1. **Frontend**: Add components in `src/components/`
2. **Backend**: Add endpoints in `backend/main.py`
3. **Services**: Update `src/services/chatService.ts` for new API calls

### Testing
- Backend: Use FastAPI's automatic documentation at `http://localhost:8000/docs`
- Frontend: Use browser developer tools for debugging

## License

This project is for educational and research purposes.
