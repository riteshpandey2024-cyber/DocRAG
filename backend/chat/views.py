import os
from django.conf import settings
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import RegisterSerializer,ChatSerializer,MessageSerializer,DocumentSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.permissions import IsAuthenticated
from .models import Chat,Message,Document
from django.shortcuts import get_object_or_404

from rag.query import ask_question
from rag.ingest import ingest_pdf,delete_chat_embeddings

chat_history=[]

@api_view(['POST'])
def chat_view(request):
    question=request.data.get("message")
    if not question:
        return Response({"error":"message required"},status=400)
    
    result=ask_question(question,chat_history)
    chat_history.append({
        "role":"user",
        "content":question
    })
    chat_history.append({
        "role":"assistant",
        "content":result['answer']
    })
    return Response(result)
    
@api_view(["POST"])
def upload_pdf(request):

    upload_file=request.FILES.get("file")
    if not upload_file:
        return Response({"error":"no files uploaded"},status=400)
    save_path=os.path.join(
        settings.MEDIA_ROOT,
        "uploads",
        upload_file.name
    )
    with open(save_path,"wb+") as destination:
        for chunk in upload_file.chunks():
            destination.write(chunk)
    chunk_count=ingest_pdf(save_path)

    return Response({
        "message": "PDF uploaded successfully",
        "chunks_added": chunk_count
    })

class RegisterView(APIView):
    def post(self,request):
        serializer=RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "message":"user created"
        })
    
class LoginView(TokenObtainPairView):
    pass

class RefreshView(TokenRefreshView):
    pass


class ChatListCreateView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        chats=Chat.objects.filter(
            user=request.user
        ).order_by("-created_at")
        serializer=ChatSerializer(chats,many=True)
        return Response(serializer.data)
    
    def post(self,request):
        chat=Chat.objects.create(
            user=request.user,
            title="New Chat"
        )
        serializer=ChatSerializer(chat)
        return Response(serializer.data)
    

class MessageListView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request,chat_id):
        chat = get_object_or_404(
            Chat,
            id=chat_id,
            user=request.user
        )
        messages=chat.messages.all()
        serializer=MessageSerializer(messages,many=True)
        return Response(serializer.data)
    
class ChatMessageView(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request,chat_id):
        user_message=request.data.get("message")
        if not user_message:
            return Response({"error":"message required"},status=400)
        chat=get_object_or_404(
            Chat,
            id=chat_id,
            user=request.user
        )
        if chat.title=='New Chat':
            title=user_message[:20]
            if len(user_message)>20:
                title+='...'
                chat.title=title
            chat.save()
        messages=chat.messages.all()
        history=[]
        for msg in messages:
            history.append({
                "role":msg.role,
                "content":msg.content
            })
        result=ask_question(
            question=user_message,
            chat_history=history,
            chat_id=chat.id
        )
        Message.objects.create(
            chat=chat,
            role="user",
            content=user_message
        )
        Message.objects.create(
            chat=chat,
            role="assistant",
            content=result["answer"]
        )
        return Response({
            "answer": result["answer"],
            "sources": result["sources"],
            "chat_title": chat.title
        })
    
class ChatDeleteView(APIView):
    permission_classes=[IsAuthenticated]
    def delete(self,request,chat_id):
        chat=get_object_or_404(
            Chat,
            id=chat_id,
            user=request.user
        )
        delete_chat_embeddings(chat.id)
        chat.delete()
        return Response({
            "message":"chat deleted sucessfully"
        })
    
class  ChatUploadView(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request,chat_id):
        chat=get_object_or_404(
            Chat,
            id=chat_id,
            user=request.user
        )

        upload_file=request.FILES.get("file")
        if not upload_file:
            return Response({"error":"No file uploaded"},
                            status=400)
        save_path=os.path.join(settings.MEDIA_ROOT,"uploads",upload_file.name)
        with open(save_path,"wb+") as destination:
            for chunk in upload_file.chunks():
                destination.write(chunk)
        Document.objects.create(chat=chat,file=f"uploads/{upload_file.name}",
        filename=upload_file.name)

        chunk_count=ingest_pdf(save_path,chat.id)
        return Response({
            "message":"PDF uploaded successfully",
            "chunks_added":chunk_count
        })
    
class ChatDocumentsView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request,pk):
        try:
            chat=get_object_or_404(
                Chat,
                id=pk,
                user=request.user
            )
        except Chat.DoesNotExist:
            return Response({"error":"Chat not found"},status=404)
        documents=chat.documents.all().order_by("-uploaded_at")
        serializer = DocumentSerializer(
            documents,
            many=True
        )

        return Response(serializer.data)