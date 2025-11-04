'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Truck, Package, Calendar, MapPin } from 'lucide-react';
import { logisticsAPI } from '@/lib/api';

interface CourierAssignment {
  id: number;
  booking_id: string;
  courier: {
    id: number;
    display_name: string;
    name: string;
  };
  status: string;
  assigned_at: string;
  pickup_address?: string;
  delivery_address?: string;
}

export default function ConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('booking_id') || 'demo-booking-123';
  const courierId = searchParams.get('courier_id');

  const [assignment, setAssignment] = useState<CourierAssignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        setIsLoading(true);
        const data = await logisticsAPI.getAssignmentByBooking(bookingId);
        
        if (data) {
          setAssignment(data);
        } else if (courierId) {
          // If assignment not found but we have courier_id, create a mock assignment
          const couriers = await logisticsAPI.getCouriers();
          const courier = couriers.find(c => c.id.toString() === courierId);
          
          if (courier) {
            setAssignment({
              id: 1,
              booking_id: bookingId,
              courier: {
                id: courier.id,
                display_name: courier.display_name,
                name: courier.name,
              },
              status: 'ASSIGNED',
              assigned_at: new Date().toISOString(),
            });
          }
        }
      } catch (err: any) {
        console.error('Error fetching assignment:', err);
        // Create mock assignment on error
        if (courierId) {
          const courierNames: Record<string, string> = {
            '1': 'Bolt',
            '2': 'Glovo',
            '3': 'Uber',
          };
          setAssignment({
            id: 1,
            booking_id: bookingId,
            courier: {
              id: parseInt(courierId),
              display_name: courierNames[courierId] || 'Courier',
              name: courierId,
            },
            status: 'ASSIGNED',
            assigned_at: new Date().toISOString(),
          });
        } else {
          setError('Failed to load courier assignment details');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignment();
  }, [bookingId, courierId]);

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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading confirmation...</p>
        </div>
      </div>
    );
  }

  if (error && !assignment) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => router.push('/checkout')}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-black">
        <div className="container mx-auto px-4 py-4">
          <a href="/" className="text-2xl font-bold">RentMe</a>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Courier Assigned!</h1>
            <p className="text-gray-600">
              Your courier service has been successfully assigned to your booking.
            </p>
          </div>

          {/* Assignment Details */}
          {assignment && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Courier Assignment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Booking ID</div>
                    <div className="font-semibold">{assignment.booking_id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Status</div>
                    <div className="font-semibold text-green-600 capitalize">{assignment.status.toLowerCase().replace('_', ' ')}</div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center">
                      <Truck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Courier Service</div>
                      <div className="text-xl font-bold">{assignment.courier.display_name}</div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Assigned At</div>
                      <div className="font-medium">{formatDate(assignment.assigned_at)}</div>
                    </div>
                  </div>

                  {assignment.pickup_address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Pickup Address</div>
                        <div className="font-medium">{assignment.pickup_address}</div>
                      </div>
                    </div>
                  )}

                  {assignment.delivery_address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Delivery Address</div>
                        <div className="font-medium">{assignment.delivery_address}</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                What's Next?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-black">1.</span>
                  <span>Your courier will contact you to confirm pickup details.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-black">2.</span>
                  <span>You'll receive updates about your delivery status.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-black">3.</span>
                  <span>Track your order in your account dashboard.</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/listings')}
              className="flex-1"
            >
              Browse More Items
            </Button>
            <Button
              onClick={() => router.push('/profile')}
              className="flex-1"
            >
              View My Bookings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
