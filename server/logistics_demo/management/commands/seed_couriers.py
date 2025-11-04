"""
Management command to seed initial courier data
Run with: python manage.py seed_couriers
"""
from django.core.management.base import BaseCommand
from logistics_demo.models import Courier


class Command(BaseCommand):
    help = 'Seed initial courier data (Bolt, Glovo, Uber)'

    def handle(self, *args, **options):
        couriers_data = [
            {
                'name': 'BOLT',
                'display_name': 'Bolt',
                'description': 'Fast and reliable delivery service'
            },
            {
                'name': 'GLOVO',
                'display_name': 'Glovo',
                'description': 'Quick delivery for your items'
            },
            {
                'name': 'UBER',
                'display_name': 'Uber',
                'description': 'On-demand delivery service'
            },
        ]

        created_count = 0
        for courier_data in couriers_data:
            courier, created = Courier.objects.get_or_create(
                name=courier_data['name'],
                defaults={
                    'display_name': courier_data['display_name'],
                    'description': courier_data['description'],
                    'is_active': True
                }
            )
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Created courier: {courier.display_name}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Courier already exists: {courier.display_name}')
                )

        self.stdout.write(
            self.style.SUCCESS(f'\nSuccessfully processed {len(couriers_data)} couriers. Created {created_count} new ones.')
        )
