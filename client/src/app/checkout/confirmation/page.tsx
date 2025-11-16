'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Truck, Package, Calendar, MapPin } from 'lucide-react';
import { listings } from '../../data/listings';

// Mock API for demonstration
const logisticsAPI = {
  getAssignmentByBooking: async (bookingId: string) => null, // Replace with real API call
  getCouriers: async () => [
    { id: 1, display_name: 'Bolt', name: 'BOLT' },
    { id: 2, display_name: 'Glovo', name: 'GLOVO' },
    { id: 3, display_name: 'Uber', name: 'UBER' },
  ],
};

interface CourierAssignment {
  id: number;
  booking_id: string;
  listing_id: number;
  amount: number;
  courier: {
    id: number;
    display_name: string;
    name: string;
  };
  status: string;
  assigned_at: string;
  pickup_address: string;
  delivery_address: string;
}

export default function ConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('booking_id') || 'demo-booking-123';
  const courierId = searchParams.get('courier_id');
  const listingId = Number(searchParams.get('listingId'));

  const [assignment, setAssignment] = useState<CourierAssignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        setIsLoading(true);

        // Fetch from backend or mock
        const data = await logisticsAPI.getAssignmentByBooking(bookingId);

        if (data) {
          setAssignment(data);
        } else if (courierId && listingId) {
          const couriers = await logisticsAPI.getCouriers();
          const courier = couriers.find(c => c.id.toString() === courierId);

          if (courier) {
          const listing = listings.find(l => l.id === listingId);

          if (courier && listing) {
            setAssignment({
              id: 1,
              booking_id: bookingId,
              listing_id: listing.id,
              amount: listing.price,
              courier: {
                id: courier.id,
                display_name: courier.display_name,
                name: courier.name,
              },
              status: 'ASSIGNED',
              assigned_at: new Date().toISOString(),
              pickup_address: searchParams.get('pickup') || 'N/A',
              delivery_address: searchParams.get('delivery') || 'N/A',
            });
          }
        }
      } catch (err: any) {
        console.error('Error fetching assignment:', err);
        setError('Failed to load courier assignment details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignment();
  }, [bookingId, courierId, listingId, searchParams]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ffaa1d] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading confirmation...</p>
        </div>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="max-w-md bg-black border-2 border-[#ffaa1d]">
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-400">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">{error}</p>
            <Button onClick={() => router.push('/checkout')} className="bg-[#ffaa1d] text-black hover:bg-[#ff9500]">Go Back</Button>
            <p className="text-gray-600 mb-4">{error || 'Assignment not found'}</p>
            <Button onClick={() => router.push('/listings')}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const listing = listings.find(l => l.id === assignment.listing_id);

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-[#ffaa1d]">
    <div className="min-h-screen bg-white">
      <header className="border-b border-black">
        <div className="container mx-auto px-4 py-4">
          <a href="/" className="text-2xl font-bold text-[#ffaa1d]">RentMe</a>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-900/20 border-2 border-green-500 rounded-full mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-white">Courier Assigned!</h1>
            <p className="text-gray-400">
              Your courier service has been successfully assigned to your booking.
            </p>
          </div>

          {/* Assignment Details */}
          {assignment && (
            <Card className="mb-6 bg-black border-2 border-[#ffaa1d]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Truck className="w-5 h-5 text-[#ffaa1d]" />
                  Courier Assignment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Booking ID</div>
                    <div className="font-semibold text-white">{assignment.booking_id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Status</div>
                    <div className="font-semibold text-green-500 capitalize">{assignment.status.toLowerCase().replace('_', ' ')}</div>
                  </div>
                </div>

                <div className="border-t border-[#ffaa1d] pt-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-[#ffaa1d] text-black rounded-full flex items-center justify-center">
                      <Truck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Courier Service</div>
                      <div className="text-xl font-bold text-white">{assignment.courier.display_name}</div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#ffaa1d] pt-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-[#ffaa1d] mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Assigned At</div>
                      <div className="font-medium text-white">{formatDate(assignment.assigned_at)}</div>
                    </div>
                  </div>

                  {assignment.pickup_address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#ffaa1d] mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Pickup Address</div>
                        <div className="font-medium text-white">{assignment.pickup_address}</div>
                      </div>
                    </div>
                  )}

                  {assignment.delivery_address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#ffaa1d] mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Delivery Address</div>
                        <div className="font-medium text-white">{assignment.delivery_address}</div>
                      </div>
                    </div>
                  )}
            <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600">Your payment was successful and courier assigned.</p>
          </div>

          {/* Booking & Listing Details */}
          {listing && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Booking & Listing Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="font-semibold">{assignment.booking_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Item:</span>
                  <span className="font-semibold">{listing.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Owner:</span>
                  <span className="font-semibold">{listing.owner}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Paid Amount:</span>
                  <span className="font-semibold">${assignment.amount}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <Card className="mb-6 bg-black border-2 border-[#ffaa1d]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Package className="w-5 h-5 text-[#ffaa1d]" />
                What's Next?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#ffaa1d]">1.</span>
                  <span>Your courier will contact you to confirm pickup details.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#ffaa1d]">2.</span>
                  <span>You'll receive updates about your delivery status.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#ffaa1d]">3.</span>
                  <span>Track your order in your account dashboard.</span>
                </li>
              </ul>
          {/* Courier & Addresses */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Courier & Addresses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Courier:</span>
                <span className="font-semibold">{assignment.courier.display_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pickup Address:</span>
                <span className="font-semibold">{assignment.pickup_address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Address:</span>
                <span className="font-semibold">{assignment.delivery_address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Assigned At:</span>
                <span className="font-semibold">{formatDate(assignment.assigned_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-semibold text-green-600">{assignment.status}</span>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/listings')}
              className="flex-1 border-[#ffaa1d] text-[#ffaa1d] hover:bg-[#ffaa1d] hover:text-black"
            >
              Browse More Items
            </Button>
            <Button
              onClick={() => router.push('/profile')}
              className="flex-1 bg-[#ffaa1d] text-black hover:bg-[#ff9500] font-bold"
            >
            <Button variant="outline" onClick={() => router.push('/listings')} className="flex-1">
              Browse More Items
            </Button>
            <Button onClick={() => router.push('/profile')} className="flex-1">
              View My Bookings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
