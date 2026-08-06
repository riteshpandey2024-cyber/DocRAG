from django.db import models
from django.contrib.auth.models import User

class Chat(models.Model):
    user=models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="chats"
    )
    title=models.CharField(
        max_length=255,
        default="New Chat"
    )
    created_at=models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.title 
    
class Message(models.Model):
    chat=models.ForeignKey(
        Chat,
        on_delete=models.CASCADE,
        related_name="messages"
    )
    role=models.CharField(
        max_length=20,
        choices=[
            ("user","user"),
            ("assistant","assistant")
        ]
    )
    content=models.TextField()
    created_at=models.DateTimeField(auto_now_add=True)

class Meta:
    ordering=["created_at"]

class Document(models.Model):
    chat=models.ForeignKey(
        Chat,
        on_delete=models.CASCADE,
        related_name="documents",
    )
    file=models.FileField(upload_to="uploads/")
    filename=models.CharField(max_length=255)
    uploaded_at=models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.filename