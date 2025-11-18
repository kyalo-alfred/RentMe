'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package, Truck, MapPin } from 'lucide-react';
import { listingsAPI } from '@/lib/api';

// Mock API for demonstration
const logisticsAPI = {
  getCouriers: async () => [
    { id: 1, name: 'BOLT', display_name: 'Bolt', description: 'Fast and reliable delivery service' },
    { id: 2, name: 'GLOVO', display_name: 'Glovo', description: 'Quick delivery for your items' },
    { id: 3, name: 'UBER', display_name: 'Uber', description: 'On-demand delivery service' },
  ],
  assignCourier: async (bookingId: string, courierId: number, pickup: string, delivery: string) => {
    console.log('Assigned courier:', bookingId, courierId, pickup, delivery);
    return { success: true };
  }
};

export default function CourierPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listingId = searchParams.get('listingId');
  const bookingId = searchParams.get('bookingId');
  
  const [listing, setListing] = useState<any>(null);
  const [listingLoading, setListingLoading] = useState(true);

  interface Courier {
    id: number;
    name: string;
    display_name: string;
    description: string;
  }

  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [selectedCourierId, setSelectedCourierId] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCouriers, setIsLoadingCouriers] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchListing = async () => {
      if (!listingId) {
        setListingLoading(false);
        return;
      }
      try {
        setListingLoading(true);
        const data = await listingsAPI.getListing(Number(listingId));
        setListing(data);
      } catch (err) {
        console.error(err);
        setListing(null);
      } finally {
        setListingLoading(false);
      }
    };
    fetchListing();
  }, [listingId]);

  useEffect(() => {
    const fetchCouriers = async () => {
      try {
        setIsLoadingCouriers(true);
        const data = await logisticsAPI.getCouriers();
        setCouriers(data);
        if (data.length > 0) setSelectedCourierId(data[0].id.toString());
      } catch (err) {
        console.error(err);
        setError('Failed to load couriers.');
      } finally {
        setIsLoadingCouriers(false);
      }
    };
    fetchCouriers();
  }, []);

  const handleAssignCourier = async () => {
    if (!selectedCourierId) {
      setError('Please select a courier.');
      return;
    }
    if (!pickupAddress.trim() || !deliveryAddress.trim()) {
      setError('Both pickup and delivery addresses are required.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await logisticsAPI.assignCourier(
        listingId!,
        parseInt(selectedCourierId),
        pickupAddress,
        deliveryAddress
      );

      // Redirect to confirmation page with all necessary info
      router.push(
        `/checkout/confirmation?listingId=${listingId}&courier_id=${selectedCourierId}&pickup=${encodeURIComponent(
          pickupAddress
        )}&delivery=${encodeURIComponent(deliveryAddress)}`
      );
    } catch (err: any) {
      console.error(err);
      setError('Failed to assign courier.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!listingLoading && !listing) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Listing not found</h1>
          <Button onClick={() => router.push('/listings')} className="bg-[#ffaa1d] text-black hover:bg-[#ff9500]">
            Back to Listings
          </Button>
        </div>
      </div>
    );
  }

  if (listingLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const selectedCourier = couriers.find(c => c.id.toString() === selectedCourierId);

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-[#ffaa1d]">
        <div className="container mx-auto px-4 py-4">
          <a href="/" className="text-2xl font-bold text-[#ffaa1d]">RentMe</a>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-white">Checkout & Courier Selection</h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <Card className="bg-black border-2 border-[#ffaa1d]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Package className="w-5 h-5 text-[#ffaa1d]" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {listing?.image && (
                    <div className="mb-4 overflow-hidden rounded-md">
                      <img src={listing.image} alt={listing.title} className="w-full h-32 object-cover" />
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Item:</span>
                    <span className="font-semibold text-white">{listing?.title}</span>
                  </div>
                  {bookingId && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Booking ID:</span>
                      <span className="font-semibold text-white">{bookingId}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rate:</span>
                    <span className="font-semibold text-white">KES {listing?.price}/{listing?.price_period}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Delivery Fee:</span>
                    <span className="font-semibold text-white">KES 500</span>
                  </div>
                  <div className="border-t border-[#ffaa1d] pt-4 mt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-white">Subtotal:</span>
                      <span className="text-[#ffaa1d]">KES {(listing?.price || 0) + 500}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Courier Selection */}
            <Card className="bg-black border-2 border-[#ffaa1d]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Truck className="w-5 h-5 text-[#ffaa1d]" />
                  Select Courier Service
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Choose your preferred delivery service
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-md">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="courier" className="text-white">Courier Service *</Label>
                  {isLoadingCouriers ? (
                    <div className="text-gray-400">Loading courier options...</div>
                  ) : (
                    <select
                      id="courier"
                      value={selectedCourierId}
                      onChange={(e) => setSelectedCourierId(e.target.value)}
                      className="bg-gray-900 border border-[#ffaa1d] text-white rounded-md px-3 py-2 w-full"
                    >
                      <option value="">Select a courier...</option>
                      {couriers.map((courier) => (
                        <option key={courier.id} value={courier.id.toString()}>
                          {courier.display_name} - {courier.description}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {selectedCourier && (
                  <div className="bg-gray-900 p-4 rounded-md border border-[#ffaa1d]">
                    <p className="font-semibold text-sm mb-1 text-white">{selectedCourier.display_name}</p>
                    <p className="text-sm text-gray-400">{selectedCourier.description}</p>
                  </div>
                )}

                <div className="space-y-4 pt-4 border-t border-[#ffaa1d]">
                  <div className="space-y-2">
                    <Label htmlFor="pickup" className="flex items-center gap-2 text-white">
                        <MapPin className="w-4 h-4 text-[#ffaa1d]" />
                        Pickup Address *
                      </Label>
                    <Input
                      id="pickup"
                      type="text"
                      placeholder="Enter pickup address"
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      disabled={isLoading}
                      className="bg-gray-900 border-[#ffaa1d] text-white placeholder:text-gray-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="delivery" className="flex items-center gap-2 text-white">
                        <MapPin className="w-4 h-4 text-[#ffaa1d]" />
                        Delivery Address *
                      </Label>
                    <Input
                      id="delivery"
                      type="text"
                      placeholder="Enter delivery address"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      disabled={isLoading}
                      className="bg-gray-900 border-[#ffaa1d] text-white placeholder:text-gray-500"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleAssignCourier}
                  disabled={isLoading || !selectedCourierId || isLoadingCouriers}
                  className="w-full bg-[#ffaa1d] text-black hover:bg-[#ff9500] font-bold"
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
