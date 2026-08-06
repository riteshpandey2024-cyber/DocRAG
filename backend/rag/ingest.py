from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings  
from langchain_chroma import Chroma
from rag.config import CHROMA_PATH, COLLECTION_NAME
import os

embeddings=HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

def ingest_pdf(pdf_path,chat_id):
    source = os.path.basename(pdf_path)
    loader=PyPDFLoader(pdf_path)
    documents=loader.load()
    splitter=RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=150
    )
    chunks=splitter.split_documents(documents)
    for i,chunk in enumerate(chunks):
        chunk.metadata["source"]=source
        chunk.metadata["chat_id"]=str(chat_id)
        chunk.metadata["chunk_id"]=i

    db=Chroma(
        persist_directory=CHROMA_PATH,
        embedding_function=embeddings,
        collection_name=COLLECTION_NAME
    )
    #removing duplicate upload
    db.delete(
        where={"source": source}
    )

    db.add_documents(chunks)
    return len(chunks)

def delete_chat_embeddings(chat_id):
    db=Chroma(
        persist_directory=CHROMA_PATH,
        embedding_function=embeddings,
        collection_name=COLLECTION_NAME
    )
    results=db.get(
        where={
            "chat_id":str(chat_id)
        }
    )
    ids=results.get("ids",[])
    if ids:
        db.delete(ids=ids)
        print(f"Deleted {len(ids)} embeddings of chat {chat_id}")