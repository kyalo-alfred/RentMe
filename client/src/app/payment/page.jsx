'use client';
export const dynamic = "force-dynamic";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { listings } from '../data/listings';

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const listingId = searchParams.get('listingId');
  const listing = listings.find(item => item.id === Number(listingId));

  const [phone, setPhone] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!listing) return <p>Listing not found.</p>;

  const handlePayment = async () => {
    if (!phone) {
      setPaymentStatus('Please enter your phone number.');
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('');

    try {
      const res = await fetch('/api/payments/mpesa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: phone,
          amount: listing.price,
          listingId: listing.id,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setPaymentStatus('Payment successful! Redirecting to checkout...');
        setTimeout(() => {
          // Redirect to checkout page after payment
          router.push(`/checkout?listingId=${listing.id}`);
        }, 1500);
      } else {
        setPaymentStatus('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setPaymentStatus('Payment error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      <div className="bg-white shadow-lg rounded-xl max-w-2xl p-6 w-full">
        <h1 className="text-2xl font-bold mb-4">Payment</h1>

        <p className="mb-2">Item: {listing.title}</p>
        <p className="mb-4">Price: ${listing.price}</p>

        <input
          type="text"
          placeholder="+254700000000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          disabled={isProcessing}
        />

        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className={`w-full py-3 rounded-lg text-white font-semibold ${
            isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isProcessing ? 'Processing Payment...' : `Pay $${listing.price}`}
        </button>

        {paymentStatus && (
          <p className="mt-4 text-center font-medium">{paymentStatus}</p>
        )}
      </div>
    </div>
  );
}
