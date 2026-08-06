from rag.retriever import retrieve_documents
from rag.llm import generate_answer
from rag.rewriter import rewrite_query
import os

# chat_history=[]


def ask_question(question, chat_history,chat_id):

    rewritten_query=rewrite_query(
        question,
        chat_history
    )

    docs=retrieve_documents(rewritten_query,chat_id)
    # context="\n\n".join(doc.page_content for doc in docs)
    context_parts=[]
    for doc in docs:
        source=doc.metadata.get("source","Unknown")
        page=doc.metadata.get("page",0)+1
        text=doc.page_content
        context_parts.append(
f"""
Source: {source}

Page: {page}

Content:

{text}

--------------------------------
""")
        context="\n".join(context_parts)

    answer=generate_answer(
        question=question,
        context=context,
        chat_history=chat_history
    )
    sources=[]
    seen = set()

    for doc in docs:

        source = os.path.basename(doc.metadata.get("source", "Unknown"))

        page = doc.metadata.get("page",0)


        key = f"{source}_{page}"
        if key not in seen:
            seen.add(key)
            sources.append({"source":source,"page":page+1})

    return {'answer':answer,"sources": sources}