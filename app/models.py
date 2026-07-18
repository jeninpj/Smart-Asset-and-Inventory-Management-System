from django.db import models
from django.contrib.auth.models import User


class Asset(models.Model):

    STATUS_CHOICES = (
        ('Available', 'Available'),
        ('Assigned', 'Assigned'),
        ('Repair', 'Repair'),
    )

    name = models.CharField(max_length=100)
    asset_type = models.CharField(max_length=100)
    serial_number = models.CharField(max_length=100, unique=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Available'
    )

    purchase_date = models.DateField()

    def __str__(self):
        return self.name


class InventoryItem(models.Model):

    item_type = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField()
    threshold = models.PositiveIntegerField()

    def __str__(self):
        return self.item_type


class Assignment(models.Model):

    asset = models.ForeignKey(
        Asset,
        on_delete=models.CASCADE
    )

    employee = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='assignments'
    )

    date_assigned = models.DateField()

    date_returned = models.DateField(
        null=True,
        blank=True
    )

    def __str__(self):
        return f"{self.asset} - {self.employee}"


class RepairTicket(models.Model):

    STATUS_CHOICES = (
        ('Open', 'Open'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
    )

    asset = models.ForeignKey(
        Asset,
        on_delete=models.CASCADE
    )

    issue = models.TextField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Open'
    )

    assigned_technician = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='repair_tickets'
    )

    def __str__(self):
        return f"{self.asset} - {self.status}"


class Profile(models.Model):

    ROLE_CHOICES = (
        ('Admin', 'Admin'),
        ('Employee', 'Employee'),
    )

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES
    )

    def __str__(self):
        return self.user.username
    

class ChatMessage(models.Model):
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='chat_messages'
    )
    role = models.CharField(max_length=10)  # 'user' or 'assistant'
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.user.username} - {self.role}"