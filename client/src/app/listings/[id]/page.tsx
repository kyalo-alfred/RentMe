"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, DollarSign, Calendar, User, Star, MessageCircle, CreditCard } from 'lucide-react';
import { listingsAPI, bookingsAPI, paymentsAPI, reviewsAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface Listing {
  id: number;
  title: string;
  description: string;
  price: string;
  price_period: string;
  location: string;
  category: string;
  condition: string;
  available_from: string;
  available_to: string;
  is_available_for_rent: boolean;
  primary_image: string | null;
  images: Array<{ id: number; image: string; is_primary: boolean }>;
  owner: {
    id: number;
    username: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string;
    rating: string;
  };
  average_rating: string;
  total_reviews: number;
}

interface Review {
  id: number;
  reviewer_details: {
    username: string;
    first_name?: string;
    last_name?: string;
  };
  rating: number;
  title?: string;
  comment: string;
  created_at: string;
}

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const listingId = parseInt(params.id as string);

  const [listing, setListing] = useState<Listing | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingDates, setBookingDates] = useState({ startDate: '', endDate: '' });
  const [bookingNotes, setBookingNotes] = useState('');
  const [availabilityCheck, setAvailabilityCheck] = useState<any>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    if (listingId) {
      fetchListing();
      fetchReviews();
    }
  }, [listingId]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      const data = await listingsAPI.getListing(listingId);
      setListing(data);
    } catch (err: any) {
      console.error('Error fetching listing:', err);
      setError('Failed to load listing details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const data = await reviewsAPI.getListingReviews(listingId);
      setReviews(data.results || data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const checkAvailability = async () => {
    if (!bookingDates.startDate || !bookingDates.endDate) {
      alert('Please select both start and end dates');
      return;
    }

    try {
      const data = await listingsAPI.checkAvailability(
        listingId,
        bookingDates.startDate,
        bookingDates.endDate
      );
      setAvailabilityCheck(data);
    } catch (err: any) {
      console.error('Error checking availability:', err);
      alert('Failed to check availability. Please try again.');
    }
  };

  const handleBooking = async () => {
    if (!user) {
      alert('Please sign in to book an item');
      router.push('/signin');
      return;
    }

    if (!availabilityCheck || !availabilityCheck.is_available) {
      alert('Item is not available for the selected dates');
      return;
    }

    setIsBooking(true);
    try {
      const booking = await bookingsAPI.createBooking(
        listingId,
        bookingDates.startDate,
        bookingDates.endDate,
        bookingNotes
      );

      // Create payment
      const payment = await paymentsAPI.createPayment(
        booking.id,
        availabilityCheck.total_price,
        'KES',
        'CARD'
      );

      // Process payment (simulated)
      const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      await paymentsAPI.processPayment(payment.id, transactionId);

      alert('Booking confirmed! Payment processed successfully.');
      router.push('/profile');
    } catch (err: any) {
      console.error('Error creating booking:', err);
      let errorMessage = 'Failed to create booking. Please try again.';
      try {
        const errorObj = JSON.parse(err.message);
        errorMessage = Object.values(errorObj).flat().join(', ') || errorMessage;
      } catch {
        errorMessage = err.message || errorMessage;
      }
      alert(errorMessage);
    } finally {
      setIsBooking(false);
    }
  };

  const contactOwner = () => {
    if (!listing) return;
    if (listing.owner.email) {
      window.location.href = `mailto:${listing.owner.email}?subject=Inquiry about ${listing.title}`;
    } else if (listing.owner.phone_number) {
      window.location.href = `tel:${listing.owner.phone_number}`;
    } else {
      alert('Owner contact information not available');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-bold mb-2">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-bold mb-2 text-red-600">{error || 'Listing not found'}</div>
          <Button onClick={() => router.push('/listings')} className="mt-4">
            Back to Listings
          </Button>
        </div>
      </div>
    );
  }

  const isOwner = user && user.id === listing.owner.id;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-black sticky top-0 bg-white z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/listings" className="text-2xl font-bold">RentMe</a>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white">
                <a href="/listings">Back to Listings</a>
              </Button>
              {user && (
                <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white">
                  <a href="/profile">Profile</a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Images and Details */}
          <div>
            {/* Main Image */}
            <div className="mb-4">
              {listing.primary_image ? (
                <img
                  src={listing.primary_image}
                  alt={listing.title}
                  className="w-full h-96 object-cover border-2 border-black"
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 border-2 border-black flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
            </div>

            {/* Additional Images */}
            {listing.images && listing.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {listing.images.slice(1, 5).map((img) => (
                  <img
                    key={img.id}
                    src={img.image}
                    alt={listing.title}
                    className="w-full h-24 object-cover border border-black cursor-pointer hover:opacity-75"
                  />
                ))}
              </div>
            )}

            {/* Description */}
            <Card className="mt-6 border-2 border-black shadow-none">
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{listing.description}</p>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card className="mt-6 border-2 border-black shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star size={20} />
                  Reviews ({listing.total_reviews})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-4 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <User size={16} />
                            <span className="font-medium">
                              {review.reviewer_details.first_name && review.reviewer_details.last_name
                                ? `${review.reviewer_details.first_name} ${review.reviewer_details.last_name}`
                                : review.reviewer_details.username}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star size={14} className="fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-bold">{review.rating}</span>
                          </div>
                        </div>
                        {review.title && (
                          <h4 className="font-semibold mb-1">{review.title}</h4>
                        )}
                        <p className="text-gray-600 text-sm">{review.comment}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No reviews yet.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking Form */}
          <div>
            <Card className="border-2 border-black shadow-none sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl">{listing.title}</CardTitle>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <DollarSign size={18} />
                    <span className="text-xl font-bold">{listing.price}</span>
                    <span className="text-gray-600">/{listing.price_period}</span>
                  </div>
                  {listing.average_rating && parseFloat(listing.average_rating) > 0 && (
                    <div className="flex items-center gap-1">
                      <Star size={18} className="fill-yellow-400 text-yellow-400" />
                      <span className="font-bold">{parseFloat(listing.average_rating).toFixed(1)}</span>
                      <span className="text-sm text-gray-600">({listing.total_reviews})</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Location */}
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={16} />
                  <span>{listing.location}</span>
                </div>

                {/* Category & Condition */}
                <div className="flex gap-4 text-sm">
                  <div>
                    <span className="font-medium">Category: </span>
                    <span>{listing.category}</span>
                  </div>
                  <div>
                    <span className="font-medium">Condition: </span>
                    <span>{listing.condition}</span>
                  </div>
                </div>

                {/* Availability Dates */}
                <div className="text-sm">
                  <span className="font-medium">Available: </span>
                  <span>
                    {new Date(listing.available_from).toLocaleDateString()} - {new Date(listing.available_to).toLocaleDateString()}
                  </span>
                </div>

                {/* Owner Info */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span className="font-medium">
                        {listing.owner.first_name && listing.owner.last_name
                          ? `${listing.owner.first_name} ${listing.owner.last_name}`
                          : listing.owner.username}
                      </span>
                    </div>
                    {listing.owner.rating && parseFloat(listing.owner.rating) > 0 && (
                      <div className="flex items-center gap-1">
                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{parseFloat(listing.owner.rating).toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  {!isOwner && (
                    <Button
                      variant="outline"
                      className="w-full border-black text-black hover:bg-black hover:text-white"
                      onClick={contactOwner}
                    >
                      <MessageCircle size={16} className="mr-2" />
                      Contact Owner
                    </Button>
                  )}
                </div>

                {!isOwner && listing.is_available_for_rent && (
                  <>
                    <div className="border-t border-gray-200 pt-4 space-y-4">
                      <h3 className="font-bold text-lg">Book This Item</h3>

                      {/* Date Selection */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="startDate">Start Date</Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={bookingDates.startDate}
                            onChange={(e) => setBookingDates({ ...bookingDates, startDate: e.target.value })}
                            min={listing.available_from}
                            max={listing.available_to}
                            className="border-black"
                          />
                        </div>
                        <div>
                          <Label htmlFor="endDate">End Date</Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={bookingDates.endDate}
                            onChange={(e) => setBookingDates({ ...bookingDates, endDate: e.target.value })}
                            min={bookingDates.startDate || listing.available_from}
                            max={listing.available_to}
                            className="border-black"
                          />
                        </div>
                      </div>

                      <Button
                        onClick={checkAvailability}
                        className="w-full bg-gray-800 text-white hover:bg-gray-700"
                        disabled={!bookingDates.startDate || !bookingDates.endDate}
                      >
                        <Calendar size={16} className="mr-2" />
                        Check Availability
                      </Button>

                      {availabilityCheck && (
                        <div className={`p-4 rounded ${availabilityCheck.is_available ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                          <div className="font-bold mb-2">
                            {availabilityCheck.is_available ? '✓ Available' : '✗ Not Available'}
                          </div>
                          {availabilityCheck.is_available && availabilityCheck.total_price && (
                            <div className="text-lg font-bold">
                              Total: {availabilityCheck.total_price} KES
                            </div>
                          )}
                        </div>
                      )}

                      {/* Notes */}
                      <div>
                        <Label htmlFor="notes">Additional Notes (Optional)</Label>
                        <textarea
                          id="notes"
                          value={bookingNotes}
                          onChange={(e) => setBookingNotes(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                          placeholder="Any special requests or questions..."
                        />
                      </div>

                      {/* Book Button */}
                      <Button
                        onClick={handleBooking}
                        disabled={!availabilityCheck?.is_available || isBooking || isProcessingPayment}
                        className="w-full bg-black text-white hover:bg-gray-800"
                      >
                        {isBooking || isProcessingPayment ? (
                          'Processing...'
                        ) : (
                          <>
                            <CreditCard size={16} className="mr-2" />
                            Book & Pay Now
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}

                {isOwner && (
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-gray-600 mb-4">This is your listing.</p>
                    <Button
                      variant="outline"
                      className="w-full border-black text-black hover:bg-black hover:text-white"
                      onClick={() => router.push('/profile')}
                    >
                      View in Profile
                    </Button>
                  </div>
                )}

                {!listing.is_available_for_rent && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded">
                    <p className="text-red-700 font-medium">This item is currently unavailable for rent.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

