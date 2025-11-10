# Bookings App - Search & Booking Module

## Overview

This app handles search, filtering, and booking functionality for the RentMe platform. It was created by **Member 3** and provides:

- Booking creation and management
- Availability tracking
- Search and filter endpoints
- RESTful API for frontend integration

## Models

### Booking
Tracks item rentals with:
- Renter (user who books)
- Listing reference (will be ForeignKey when listings app is ready)
- Start/end dates
- Status (PENDING, CONFIRMED, ACTIVE, COMPLETED, CANCELLED)
- Total price
- Notes

### Availability
Tracks when listings are unavailable:
- Listing reference
- Date range
- Booking reference (if blocked by booking)
- Reason for unavailability

## API Endpoints

### Bookings

- `GET /api/bookings/` - List all bookings
- `POST /api/bookings/` - Create a new booking
- `GET /api/bookings/{id}/` - Get booking details
- `PUT/PATCH /api/bookings/{id}/` - Update booking
- `DELETE /api/bookings/{id}/` - Delete booking
- `GET /api/bookings/search/` - Search bookings
- `GET /api/bookings/my_bookings/` - Get current user's bookings
- `POST /api/bookings/{id}/cancel/` - Cancel a booking

### Availability

- `GET /api/bookings/availability/` - List availability blocks
- `POST /api/bookings/availability/` - Create availability block
- `GET /api/bookings/availability/check/` - Check if listing is available

## Usage Examples

### Create a Booking

```bash
POST /api/bookings/
{
  "listing_id": 1,
  "start_date": "2024-01-15",
  "end_date": "2024-01-20",
  "notes": "Need for weekend event"
}
```

### Search Bookings

```bash
GET /api/bookings/search/?query=test&status=CONFIRMED&listing_id=1
```

### Check Availability

```bash
GET /api/bookings/availability/check/?listing_id=1&start_date=2024-01-15&end_date=2024-01-20
```

## Next Steps

1. **Update Listing Reference**: When Member 2 creates the listings app, update the `listing_id` fields to use `ForeignKey('listings.Listing')` instead of `IntegerField`.

2. **Add Price Calculation**: Integrate with listings app to calculate total price based on listing's daily rate.

3. **Add Notifications**: Send email notifications when bookings are created, confirmed, or cancelled.

4. **Add Reviews**: Allow users to leave reviews after completing a booking.

## Testing

Run tests with:
```bash
python manage.py test bookings
```

## Notes

- The app currently uses `listing_id` as an IntegerField. This will be updated to a ForeignKey when the listings app is created.
- Availability checking prevents double bookings automatically.
- Only authenticated users can create bookings.
- Users can only view/edit their own bookings (unless staff).


