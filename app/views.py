from django.contrib.auth.models import User

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

import requests
from .models import ChatMessage
from .serializers import ChatMessageSerializer

from .models import (
    Asset,
    InventoryItem,
    Assignment,
    RepairTicket,
    Profile,
)

from .serializers import (
    AssetSerializer,
    InventorySerializer,
    AssignmentSerializer,
    RepairTicketSerializer,
    UserSerializer,
)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard(request):

    data = {
        "total_assets": Asset.objects.count(),
        "available_assets": Asset.objects.filter(
            status="Available"
        ).count(),
        "assigned_assets": Asset.objects.filter(
            status="Assigned"
        ).count(),
        "repair_assets": Asset.objects.filter(
            status="Repair"
        ).count(),
        "total_repairs": RepairTicket.objects.count(),
        "recent_assets": list(

            Asset.objects.order_by("-id").values(
                "id",
                "name",
                "asset_type",
                "status",
            )[:5]
        )
    }

    return Response(data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def profile_api(request):

    profile, created = Profile.objects.get_or_create(

        user=request.user,
        defaults={
            "role": "Employee"
        }
    )

    data = {
        "id": request.user.id,
        "username": request.user.username,
        "first_name": request.user.first_name,
        "last_name": request.user.last_name,
        "email": request.user.email,
        "role": profile.role,
    }

    return Response(data)



class AssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.all().order_by("-id")
    serializer_class = AssetSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_fields = [
        "status",
        "asset_type",
    ]

    search_fields = [
        "name",
        "serial_number",
    ]

    ordering_fields = [
        "name",
        "purchase_date",
        "status",
    ]


class InventoryViewSet(viewsets.ModelViewSet):
    queryset = InventoryItem.objects.all().order_by("-id")
    serializer_class = InventorySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [
        SearchFilter,
        OrderingFilter,
    ]

    search_fields = [
        "item_type",
    ]

    ordering_fields = [
        "quantity",
        "threshold",
    ]


class RepairTicketViewSet(viewsets.ModelViewSet):
    queryset = RepairTicket.objects.all().order_by("-id")
    serializer_class = RepairTicketSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_fields = [
        "status",
    ]

    search_fields = [
        "asset__name",
        "issue",
        "assigned_technician__username",
    ]

    ordering_fields = [
        "status",
    ]

    def perform_create(self, serializer):
        asset = serializer.validated_data["asset"]
        if asset.status == "Assigned":
            raise ValidationError(
                "Assigned assets cannot be sent for repair."
            )

        ticket = serializer.save()
        asset.status = "Repair"
        asset.save()

    def perform_update(self, serializer):
        ticket = serializer.save()
        asset = ticket.asset

        if ticket.status == "Completed":
            asset.status = "Available"
        else:
            asset.status = "Repair"
        asset.save()

    def perform_destroy(self, instance):
        asset = instance.asset
        instance.delete()
        asset.status = "Available"
        asset.save()


class AssignmentViewSet(viewsets.ModelViewSet):

    queryset = Assignment.objects.all().order_by("-id")
    serializer_class = AssignmentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [
        SearchFilter,
        OrderingFilter,
    ]

    search_fields = [
        "asset__name",
        "employee__username",
    ]

    ordering_fields = [
        "date_assigned",
        "date_returned",
    ]

    def perform_create(self, serializer):
        asset = serializer.validated_data["asset"]
        if asset.status != "Available":
            raise ValidationError(
                "This asset is not available for assignment."
            )
        assignment = serializer.save()
        asset.status = "Assigned"
        asset.save()

    def perform_update(self, serializer):
        assignment = serializer.save()
        asset = assignment.asset
        if assignment.date_returned:
            asset.status = "Available"
        else:
            asset.status = "Assigned"
        asset.save()

    def perform_destroy(self, instance):
        asset = instance.asset
        instance.delete()
        asset.status = "Available"
        asset.save()


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.filter(
        is_active=True
    ).order_by("username")

    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


# Ollama API Endpoint
OLLAMA_URL = "http://localhost:11434/api/chat"
MODEL_NAME = "tinyllama"  # Change this if you use a different model
MAX_HISTORY_LIMIT = 50 # Strict limit for stored history

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def chat_api(request):
    
    if request.method == "GET":
        # Fetch last 50 messages for the current user
        messages = ChatMessage.objects.filter(
            user=request.user
        ).order_by("-created_at")[:MAX_HISTORY_LIMIT]
        
        # Reverse to show oldest first in chat UI
        serializer = ChatMessageSerializer(
            reversed(messages), 
            many=True
        )
        return Response(serializer.data)

    elif request.method == "POST":
        user_message = request.data.get("message")
        
        if not user_message:
            return Response(
                {"error": "Message is required"}, 
                status=400
            )

        # 1. Save User Message
        ChatMessage.objects.create(
            user=request.user, 
            role="user", 
            content=user_message
        )

        # 2. Get Context for LLM (Send last 10 messages to save tokens)
        context_messages = ChatMessage.objects.filter(
            user=request.user
        ).order_by("-created_at")[:10]
        
        # Format for Ollama (oldest to newest)
        ollama_payload = [
            {"role": m.role, "content": m.content} 
            for m in reversed(context_messages)
        ]

        # 3. Call Ollama API
        try:
            response = requests.post(
                OLLAMA_URL, 
                json={
                    "model": MODEL_NAME,
                    "messages": ollama_payload,
                    "stream": False
                },
                timeout=120 # Ollama might take a few seconds
            )
            ollama_data = response.json()
            ai_response = ollama_data.get("message", {}).get("content", "No response generated.")
            
        except requests.exceptions.ConnectionError:
            ai_response = "️ Error: Ollama is not running. Please start Ollama and pull the 'llama3' model."
        except Exception as e:
            ai_response = f"⚠️ Error connecting to LLM: {str(e)}"

        # 4. Save AI Response
        ChatMessage.objects.create(
            user=request.user, 
            role="assistant", 
            content=ai_response
        )

        # 5. Enforce Strict History Limit (Delete older messages)
        messages_to_keep = ChatMessage.objects.filter(
            user=request.user
        ).order_by("-created_at")[:MAX_HISTORY_LIMIT]
        
        ids_to_keep = [m.id for m in messages_to_keep]
        ChatMessage.objects.filter(
            user=request.user
        ).exclude(id__in=ids_to_keep).delete()

        return Response({"response": ai_response})