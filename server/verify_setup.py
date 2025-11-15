#!/usr/bin/env python
"""
Setup Verification Script for RentMe Project
Run this script to verify your setup is correct.
"""

import os
import sys
from pathlib import Path


def check_python_version():
    """Check if Python version is 3.8+"""
    version = sys.version_info
    if version.major == 3 and version.minor >= 8:
        print("✅ Python version:", sys.version.split()[0])
        return True
    else:
        print("❌ Python 3.8+ required. Current version:", sys.version.split()[0])
        return False


def check_django():
    """Check if Django is installed"""
    try:
        import django
        print("✅ Django installed:", django.get_version())
        return True
    except ImportError:
        print("❌ Django not installed. Run: pip install -r requirements.txt")
        return False


def check_postgresql_driver():
    """Check if psycopg2 is installed"""
    try:
        import psycopg2
        print("✅ PostgreSQL driver (psycopg2) installed")
        return True
    except ImportError:
        print("❌ psycopg2 not installed. Run: pip install psycopg2-binary")
        return False


def check_env_file():
    """Check if .env file exists"""
    env_path = Path(__file__).parent / '.env'
    if env_path.exists():
        print("✅ .env file exists")
        return True
    else:
        print("⚠️  .env file not found. Create it from env.template")
        return False


def check_database_connection():
    """Check if database connection works"""
    try:
        import django
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rentme.settings')
        django.setup()

        from django.db import connection
        connection.ensure_connection()
        print("✅ Database connection successful")
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        print("   Check your .env file and PostgreSQL is running")
        return False


def check_migrations():
    """Check if migrations are up to date"""
    try:
        import django
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rentme.settings')
        django.setup()

        from django.core.management import call_command
        from io import StringIO

        out = StringIO()
        call_command('showmigrations', '--list', stdout=out)
        migrations = out.getvalue()

        if '[X]' in migrations:
            print("✅ Migrations applied")
            return True
        else:
            print("⚠️  No migrations applied yet. Run: python manage.py migrate")
            return False
    except Exception as e:
        print(f"❌ Error checking migrations: {e}")
        return False


def main():
    """Run all checks"""
    print("=" * 50)
    print("RentMe Setup Verification")
    print("=" * 50)
    print()

    checks = [
        ("Python Version", check_python_version),
        ("Django Installation", check_django),
        ("PostgreSQL Driver", check_postgresql_driver),
        (".env File", check_env_file),
        ("Database Connection", check_database_connection),
        ("Migrations", check_migrations),
    ]

    results = []
    for name, check_func in checks:
        print(f"Checking {name}...")
        result = check_func()
        results.append(result)
        print()

    print("=" * 50)
    print("Summary")
    print("=" * 50)

    passed = sum(results)
    total = len(results)

    if passed == total:
        print(f"✅ All checks passed ({passed}/{total})")
        print("Your setup is ready!")
    else:
        print(f"⚠️  Some checks failed ({passed}/{total})")
        print("Please fix the issues above before proceeding.")

    return passed == total


if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)


