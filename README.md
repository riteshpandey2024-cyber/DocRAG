# DocRAG

DocRAG is a full-stack Retrieval-Augmented Generation (RAG) application for chatting with PDF documents.

Users can register, log in, create multiple chats, upload PDFs per chat, and ask natural-language questions over the uploaded content. The backend performs query rewriting, hybrid retrieval, and answer generation with source citations.

## What the project does

- Upload PDF files into a specific chat
- Extract and chunk PDF content
- Store embeddings in ChromaDB
- Retrieve relevant context using hybrid search
- Rewrite follow-up questions into standalone questions
- Generate grounded answers with Groq
- Show answer sources with page references
- Persist chats, messages, and uploaded documents

## Tech stack

### Backend

- Django 6
- Django REST Framework
- SimpleJWT authentication
- ChromaDB
- LangChain
- Hugging Face embeddings
- Groq
- BM25 retrieval

### Frontend

- React
- Vite
- Zustand
- Axios
- React Router
- React Markdown
- React Hot Toast

## Architecture

1. User registers or logs in.
2. Frontend stores JWT access and refresh tokens.
3. User creates a chat and uploads a PDF.
4. Backend saves the PDF, extracts text, chunks it, and stores embeddings in ChromaDB.
5. When the user asks a question, the backend rewrites the question using chat history.
6. The retriever combines MMR, vector similarity, and BM25 to find relevant chunks.
7. The LLM generates an answer using only the retrieved context.
8. The frontend renders the answer and source citations.

## Key features

- Multi-chat support
- Chat-specific document uploads
- JWT protected API endpoints
- Persistent chat history
- Source citations with page numbers
- Delete chat with embeddings cleanup
- Markdown-formatted answers

## Backend flow

### Authentication

- `POST /api/register/` creates a user
- `POST /api/login/` returns JWT access and refresh tokens
- `POST /api/refresh/` renews access tokens

### Chat and document flow

- `POST /api/chats/` creates a new chat
- `GET /api/chats/` lists user chats
- `POST /api/chats/<chat_id>/upload/` uploads a PDF into a chat
- `GET /api/chats/<chat_id>/documents/` lists uploaded PDFs
- `POST /api/chats/<chat_id>/message/` asks a question in a chat
- `GET /api/chats/<chat_id>/messages/` loads chat history
- `DELETE /api/chats/<chat_id>/` deletes a chat and its embeddings

## Retrieval pipeline

The backend uses a hybrid RAG pipeline:

- Query rewriting: converts follow-up questions into standalone questions
- MMR retrieval: improves diversity of returned chunks
- Vector similarity search: finds semantically relevant chunks
- BM25 search: improves keyword-based matching
- Deduplication: removes repeated chunks
- Structured context building: formats source, page, and content blocks
- Answer generation: returns a final response and citations

## Important implementation details

- Uploaded PDFs are stored under `backend/media/uploads/`
- Embeddings are persisted in `backend/chroma_db/`
- The SQLite database is `backend/db.sqlite3`
- JWT authentication is enabled in Django REST Framework settings
- The frontend API base URL is `http://127.0.0.1:8000/api/`
- Login expects the email value to be sent as `username`

## Environment variables

Create `backend/.env` with:

```env
GROQ_API_KEY=your_groq_api_key
HF_TOKEN=your_huggingface_token
```

Do not commit real secrets to the repository.

## Local setup

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Open the app

- Frontend: `http://localhost:5173`
- Backend API: `http://127.0.0.1:8000/api/`

## Common issues

- If Django cannot start, verify the virtual environment is activated.
- If login fails with 401, make sure you registered with the same email you use to log in.
- If refresh errors appear, clear browser local storage and log in again.
- If PDF uploads fail, ensure `backend/media/uploads/` exists.

## API endpoints

### Auth

- `POST /api/register/`
- `POST /api/login/`
- `POST /api/refresh/`

### Chats

- `GET /api/chats/`
- `POST /api/chats/`
- `GET /api/chats/<chat_id>/messages/`
- `POST /api/chats/<chat_id>/message/`
- `DELETE /api/chats/<chat_id>/`
- `POST /api/chats/<chat_id>/upload/`
- `GET /api/chats/<chat_id>/documents/`

## Project structure

```text
DocRAG/
├── backend/
│   ├── core/
│   ├── chat/
│   ├── rag/
│   ├── db.sqlite3
│   └── manage.py
└── frontend/
	├── src/
	│   ├── api/
	│   ├── components/
	│   ├── pages/
	│   └── store/
	└── package.json
```

## How the frontend works

- `Login.jsx` handles authentication and stores JWT tokens
- `Sidebar.jsx` lists chats, creates new chats, and deletes chats
- `ChatWindow.jsx` loads messages, uploads PDFs, and sends user questions
- `ChatPage.jsx` combines the sidebar and chat window layout

## How the backend works

- `chat/views.py` exposes auth, chat, upload, and messaging endpoints
- `rag/rewriter.py` rewrites follow-up questions
- `rag/retriever.py` performs hybrid retrieval
- `rag/ingest.py` parses PDFs and stores embeddings
- `rag/llm.py` generates the final answer

## Recommended next step

If you want, I can also turn this into a more polished README with badges, screenshots, and a quick demo section.
