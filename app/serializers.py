from rest_framework import serializers
from .models import Asset, InventoryItem, Assignment, RepairTicket, Profile, ChatMessage
from django.contrib.auth.models import User



class AssetSerializer(serializers.ModelSerializer):

    class Meta:
        model = Asset
        fields = "__all__"


class InventorySerializer(serializers.ModelSerializer):

    class Meta:
        model = InventoryItem
        fields = "__all__"


class AssignmentSerializer(serializers.ModelSerializer):
    asset_name = serializers.CharField(
        source="asset.name",
        read_only=True
    )
    employee_name = serializers.CharField(
        source="employee.username",
        read_only=True
    )
    class Meta:
        model = Assignment
        fields = "__all__"

class RepairTicketSerializer(serializers.ModelSerializer):

    asset_name = serializers.CharField(
        source="asset.name",
        read_only=True
    )
    technician_name = serializers.CharField(
        source="assigned_technician.username",
        read_only=True
    )
    class Meta:
        model = RepairTicket
        fields = "__all__"


class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email"
        ]


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'role', 'content', 'created_at']