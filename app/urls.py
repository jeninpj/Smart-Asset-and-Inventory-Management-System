from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView,)
from . import views


router = DefaultRouter()

router.register(r"assets", views.AssetViewSet, basename="assets")
router.register( r"inventory", views.InventoryViewSet, basename="inventory")
router.register(r"tickets", views.RepairTicketViewSet, basename="tickets")
router.register(r"assignments", views.AssignmentViewSet, basename="assignments")
router.register(r"users", views.UserViewSet, basename="users")


urlpatterns = [
    path("api/login/", TokenObtainPairView.as_view(), name="token_obtain_pair",),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh",),
    path("api/dashboard/", views.dashboard, name="dashboard",),
    path("api/profile/", views.profile_api, name="profile_api",),
    path("api/", include(router.urls),),
    path("api/chat/", views.chat_api, name="chat_api",),
]