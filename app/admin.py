from django.contrib import admin
from .models import *


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):

    list_display = ['user', 'role']


@admin.register(Asset)
class AssetAdmin(admin.ModelAdmin):

    list_display = [
        'name',
        'asset_type',
        'serial_number',
        'status',
        'purchase_date'
    ]

    search_fields = [
        'name',
        'serial_number'
    ]

    list_filter = [
        'status',
        'asset_type'
    ]


@admin.register(InventoryItem)
class InventoryItemAdmin(admin.ModelAdmin):

    list_display = [
        'item_type',
        'quantity',
        'threshold'
    ]


@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):

    list_display = [
        'asset',
        'employee',
        'date_assigned',
        'date_returned'
    ]

    list_filter = [
        'date_assigned'
    ]


@admin.register(RepairTicket)
class RepairTicketAdmin(admin.ModelAdmin):

    list_display = [
        'asset',
        'status',
        'assigned_technician'
    ]

    list_filter = [
        'status'
    ]

    search_fields = [
        'asset__name'
    ]