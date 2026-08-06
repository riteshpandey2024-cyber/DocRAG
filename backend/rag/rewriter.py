from langchain_huggingface import ChatHuggingFace,HuggingFaceEndpoint
from langchain_core.messages import HumanMessage,SystemMessage
from dotenv import load_dotenv

load_dotenv()

llm=HuggingFaceEndpoint(
    repo_id="deepseek-ai/DeepSeek-V4-Flash-0731",
    task='text-generation'
)
model=ChatHuggingFace(llm=llm)

def rewrite_query(question,chat_history):
    if len(chat_history)==0:
        return question
    history_text=""
    for message in chat_history[-6:]:
        role=message['role']
        content=message['content']
        history_text+=f"{role}: {content}\n"
        
    messages = [
        SystemMessage(
            content="""
You are a query rewriting assistant.

Your task is to convert follow-up questions into
standalone questions.

Use the conversation history to resolve references
such as:
- it
- that
- those features
- the second one
- explain more

Return ONLY the rewritten question.

If the question is already standalone,
return it unchanged.
"""
        ),
        HumanMessage(
            content=f"""
Conversation History:
{history_text}

Current Question:
{question}
"""
        )
    ]
        
    response=model.invoke(messages)
    return response.content.strip()