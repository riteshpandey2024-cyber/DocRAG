from langchain_groq import ChatGroq
from langchain_core.messages import (HumanMessage,AIMessage,SystemMessage)
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv

load_dotenv()

llm=ChatGroq(model="openai/gpt-oss-120b")

def generate_answer(question,context,chat_history):
    messages=[
        SystemMessage(
            # content="""
            #     You are a helpful RAG assistant.
            #     Rules:
            #     1. Answer only using the provided context.
            #     2. Use the chat history to understand references such as
            #     'it', 'that feature', 'the second point', etc.
            #     3. If the answer is not present in the context,
            #     say that the information is not available.
            #     4. Do not hallucinate.
            # """
            content="""
You are a helpful RAG assistant.

Rules:

1. Answer ONLY using the provided context.

2. Use the chat history to understand references such as:

* it
* that feature
* the second point
* explain more

3. Format the answer using Markdown:

* Use ## for headings when appropriate.
* Use **bold** for important entities, names and keywords.
* Use bullet points for lists.
* Use numbered lists when order matters.
* Use > blockquotes for conclusions or important notes.

4. If the answer is not present in the context, say:

"The information is not available."

5. Do not hallucinate or invent facts.
   """


        )
    ]

    for message in chat_history:
        if message['role']=='user':
            messages.append(HumanMessage(content=message['content']))
        elif message['role']=='assistant':
            messages.append(AIMessage(content=message['content']))

    messages.append(
        HumanMessage(
            content=f"""
Context:
{context}

Question:
{question}
            """
        )
    )
    response = llm.invoke(messages)
    return response.content