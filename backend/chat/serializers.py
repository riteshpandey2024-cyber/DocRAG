from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Chat,Message,Document

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    name = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["name", "email", "password"]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["email"],
            first_name=validated_data["name"],
            email=validated_data["email"],
            password=validated_data["password"]
        )
        return user
    
class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model=Chat
        fields=["id","title","created_at"]
    
class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model=Message
        fields=["id","role","content","created_at"]

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model=Document
        fields=["id","filename","file","uploaded_at"]

