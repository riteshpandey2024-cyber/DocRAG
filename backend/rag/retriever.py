from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from rag.config import(CHROMA_PATH,COLLECTION_NAME)
from rag.bm25_retriever import bm25_search

embeddings=HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

db=Chroma(
    persist_directory=CHROMA_PATH,
    embedding_function=embeddings,
    collection_name=COLLECTION_NAME
)

# def retrieve_documents(query, chat_id ,k=4):
#     return db.max_marginal_relevance_search(query, k=k,fetch_k=10,filter={"chat_id":str(chat_id)})

def retrieve_documents(query,chat_id,k=4):
    vector_docs=db.max_marginal_relevance_search(
        query=query,
        k=k,
        fetch_k=10,
        filter={
            "chat_id":str(chat_id)
        }
    )
    for doc in vector_docs:
        print(
            doc.metadata.get("page"),
            doc.metadata.get("chunk_id"),
            doc.metadata.get("source")
        )
    candidate_docs=db.similarity_search(
        query=query,
        k=20,
        filter={"chat_id":str(chat_id)}
    )
    bm25_docs=bm25_search(
        query=query,
        docs=candidate_docs,
        k=k
    )
    print("MMR:", len(vector_docs))
    print("Candidates:", len(candidate_docs))
    print("BM25:", len(bm25_docs))
    merged_docs=[]
    seen=set()
    for doc in vector_docs+bm25_docs:
        key=(
            doc.metadata.get("source"),
            doc.metadata.get("page"),
            doc.page_content
        )
        if key not in seen:
            seen.add(key)
            merged_docs.append(doc)
    return merged_docs