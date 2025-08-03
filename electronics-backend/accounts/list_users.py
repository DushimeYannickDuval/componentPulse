# your_app/management/commands/list_users.py
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'List all registered users'

    def handle(self, *args, **options):
        users = User.objects.all().order_by('-date_joined')
        
        self.stdout.write(
            self.style.SUCCESS(f'Found {users.count()} users:')
        )
        
        for user in users:
            provider_info = f"({user.provider})" if user.provider != 'email' else ""
            firebase_info = f" [Firebase: {user.firebase_uid[:8]}...]" if user.firebase_uid else ""
            
            self.stdout.write(
                f"• {user.email} - {user.first_name} {user.last_name} "
                f"{provider_info}{firebase_info} "
                f"(Joined: {user.date_joined.strftime('%Y-%m-%d %H:%M')})"
            )