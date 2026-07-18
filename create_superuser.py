import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
django.setup()

from django.contrib.auth.models import User

# Create superuser if not exists
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser(
        username='admin',
        email='admin@example.com',
        password='admin123'
    )
    print("✅ Superuser created! Username: admin, Password: admin123")
else:
    print("⚠️ Superuser already exists")