# Logistics Demo Module

This module handles the courier selection and assignment functionality for the RentMe platform.

## Features

- **Courier Management**: Pre-configured courier services (Bolt, Glovo, Uber)
- **Courier Assignment**: Assign couriers to bookings/orders
- **Status Tracking**: Track courier assignment status
- **API Endpoints**: RESTful API for frontend integration

## Models

### Courier
Represents available courier services:
- `name`: Courier code (BOLT, GLOVO, UBER)
- `display_name`: Human-readable name
- `description`: Service description
- `is_active`: Whether the service is available

### CourierAssignment
Tracks courier assignments for bookings:
- `booking_id`: Reference to the booking/order
- `courier`: Foreign key to Courier
- `user`: Foreign key to User
- `pickup_address`: Optional pickup address
- `delivery_address`: Optional delivery address
- `status`: Assignment status (ASSIGNED, IN_TRANSIT, DELIVERED, etc.)

## API Endpoints

### Get Available Couriers
```
GET /api/logistics/couriers/available/
```
Returns list of all active courier services.

### Create Courier Assignment
```
POST /api/logistics/assignments/
Body: {
  "booking_id": "string",
  "courier_id": integer,
  "pickup_address": "string (optional)",
  "delivery_address": "string (optional)"
}
```

### Get Assignment by Booking
```
GET /api/logistics/assignments/by_booking/?booking_id=<booking_id>
```

## Setup

1. Migrations have been created and applied
2. Seed couriers data:
   ```bash
   python manage.py seed_couriers
   ```

## Frontend Integration

The frontend checkout page (`/checkout`) allows users to:
1. Select a courier from dropdown (Bolt, Glovo, Uber)
2. Optionally enter pickup and delivery addresses
3. Confirm assignment
4. View confirmation page with assignment details

## Admin

Courier and CourierAssignment models are registered in Django admin for management.

## Notes

- This is a **demo** module - all courier assignments are simulated
- The module is designed to be easily extended with real courier API integrations
- Booking IDs are flexible strings to work with different booking/order systems

