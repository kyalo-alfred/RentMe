"""
Script to check database before running migration
Run this before running the migration to identify potential issues
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rentme.settings')
django.setup()

from accounts.models import User

def check_database():
    print("=== Pre-Migration Database Check ===\n")
    
    # Check for users with blank emails
    users_without_email = User.objects.filter(email='')
    if users_without_email.exists():
        print(f"⚠️  WARNING: Found {users_without_email.count()} user(s) with blank emails:")
        for user in users_without_email[:5]:  # Show first 5
            print(f"   - User ID {user.id}: {user.username}")
        if users_without_email.count() > 5:
            print(f"   ... and {users_without_email.count() - 5} more")
        print("\n   ACTION REQUIRED: These users need emails before migration can proceed.")
        print("   You can fix them in Django shell:\n")
        print("   python manage.py shell")
        print("   from accounts.models import User")
        print("   user = User.objects.get(id=X)")
        print("   user.email = 'user@example.com'  # Set appropriate email")
        print("   user.save()")
        return False
    else:
        print("✅ No users with blank emails found")
    
    # Check for duplicate emails
    from django.db.models import Count
    duplicate_emails = User.objects.values('email').annotate(
        count=Count('email')
    ).filter(count__gt=1, email__isnull=False).exclude(email='')
    
    if duplicate_emails.exists():
        print(f"\n⚠️  WARNING: Found duplicate emails:")
        for dup in duplicate_emails:
            email = dup['email']
            count = dup['count']
            print(f"   - Email '{email}' is used by {count} user(s)")
            users = User.objects.filter(email=email)
            for user in users:
                print(f"     User ID {user.id}: {user.username}")
        print("\n   ACTION REQUIRED: Fix duplicate emails before migration can proceed.")
        return False
    else:
        print("✅ No duplicate emails found")
    
    # Check total user count
    total_users = User.objects.count()
    print(f"\n✅ Total users in database: {total_users}")
    
    print("\n=== Database is ready for migration! ===")
    return True

if __name__ == '__main__':
    try:
        is_ready = check_database()
        if is_ready:
            print("\nYou can now run: python manage.py migrate accounts")
        else:
            print("\nPlease fix the issues above before running the migration.")
            exit(1)
    except Exception as e:
        print(f"\n❌ Error checking database: {e}")
        print("Make sure you're in the server directory and Django is properly configured.")
        exit(1)

