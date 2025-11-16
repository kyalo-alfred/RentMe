'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { logisticsAPI } from '@/lib/api';
import { Package, Truck, MapPin } from 'lucide-react';

interface Courier {
  id: number;
  name: string;
  display_name: string;
  description: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('booking_id') || 'demo-booking-123';
  
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [selectedCourierId, setSelectedCourierId] = useState<string>('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCouriers, setIsLoadingCouriers] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch available couriers on component mount
  useEffect(() => {
    const fetchCouriers = async () => {
      try {
        setIsLoadingCouriers(true);
        const data = await logisticsAPI.getCouriers();
        setCouriers(data);
        if (data.length > 0 && !selectedCourierId) {
          setSelectedCourierId(data[0].id.toString());
        }
      } catch (err) {
        console.error('Error fetching couriers:', err);
        setError('Failed to load courier options. Please refresh the page.');
        // Fallback to mock data if API fails
        setCouriers([
          { id: 1, name: 'BOLT', display_name: 'Bolt', description: 'Fast and reliable delivery service' },
          { id: 2, name: 'GLOVO', display_name: 'Glovo', description: 'Quick delivery for your items' },
          { id: 3, name: 'UBER', display_name: 'Uber', description: 'On-demand delivery service' },
        ]);
        setSelectedCourierId('1');
      } finally {
        setIsLoadingCouriers(false);
      }
    };

    fetchCouriers();
  }, []);

  const handleAssignCourier = async () => {
    if (!selectedCourierId) {
      setError('Please select a courier service');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const assignment = await logisticsAPI.assignCourier(
        bookingId,
        parseInt(selectedCourierId),
        pickupAddress,
        deliveryAddress
      );

      // Redirect to confirmation page
      router.push(`/checkout/confirmation?booking_id=${bookingId}&courier_id=${selectedCourierId}`);
    } catch (err: any) {
      console.error('Error assigning courier:', err);
      setError(err.message || 'Failed to assign courier. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCourier = couriers.find(c => c.id.toString() === selectedCourierId);

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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout & Courier Selection</h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking ID:</span>
                    <span className="font-semibold">{bookingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Item Rental:</span>
                    <span className="font-semibold">$50.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee:</span>
                    <span className="font-semibold">$5.00</span>
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>$55.00</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Courier Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Select Courier Service
                </CardTitle>
                <CardDescription>
                  Choose your preferred delivery service
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="courier">Courier Service *</Label>
                  {isLoadingCouriers ? (
                    <div className="text-gray-500">Loading courier options...</div>
                  ) : (
                    <Select
                      id="courier"
                      value={selectedCourierId}
                      onChange={(e) => setSelectedCourierId(e.target.value)}
                      disabled={isLoading}
                    >
                      {couriers.map((courier) => (
                        <option key={courier.id} value={courier.id}>
                          {courier.display_name} - {courier.description}
                        </option>
                      ))}
                    </Select>
                  )}
                </div>

                {selectedCourier && (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="font-semibold text-sm mb-1">{selectedCourier.display_name}</p>
                    <p className="text-sm text-gray-600">{selectedCourier.description}</p>
                  </div>
                )}

                <div className="space-y-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="pickup" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Pickup Address (Optional)
                    </Label>
                    <Input
                      id="pickup"
                      type="text"
                      placeholder="Enter pickup address"
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="delivery" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Delivery Address (Optional)
                    </Label>
                    <Input
                      id="delivery"
                      type="text"
                      placeholder="Enter delivery address"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleAssignCourier}
                  disabled={isLoading || !selectedCourierId || isLoadingCouriers}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? 'Assigning Courier...' : 'Confirm & Assign Courier'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

