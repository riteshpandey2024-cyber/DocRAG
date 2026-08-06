from django.urls import path
from .views import *

urlpatterns=[
    path("chat/",chat_view),
    path("upload/",upload_pdf),
    path("register/",RegisterView.as_view()),
    path("login/",LoginView.as_view()),
    path("refresh/",RefreshView.as_view()),
    path("chats/",ChatListCreateView.as_view()),
    path("chats/<int:chat_id>/messages/",MessageListView.as_view()),
    path("chats/<int:chat_id>/message/",ChatMessageView.as_view()),
    path("chats/<int:chat_id>/", ChatDeleteView.as_view()),
    path("chats/<int:chat_id>/upload/", ChatUploadView.as_view()),
    path("chats/<int:pk>/documents/",ChatDocumentsView.as_view())
]