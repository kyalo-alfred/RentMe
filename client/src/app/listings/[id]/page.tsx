"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { listings } from "../../data/listings";

export default function ListingDetailsPage({ params }: any) {
  const router = useRouter();

  // ✅ UNWRAP params safely (Next.js App Router rule)
  const resolvedParams = use(params);
  const listingId = Number(resolvedParams.id);

  // ✅ Find the correct listing
  const listing = listings.find((item) => item.id === listingId);

  if (!listing) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-bold text-red-600">Listing not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 flex flex-col items-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full overflow-hidden">

        {/* Image */}
        <img
          src={listing.image}
          alt={listing.title}
          className="w-full h-80 object-cover"
        />

        {/* Content */}
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
          <p className="text-gray-600 mb-1">{listing.location}</p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Category:</span> {listing.category}
          </p>
          <p className="text-gray-700 mb-2">{listing.description}</p>
          <p className="text-blue-600 font-semibold text-lg mb-2">
            ${listing.price} / {listing.period}
          </p>
          <p className="text-yellow-500 mb-4">⭐ {listing.rating}</p>

          <button
            onClick={() =>
              router.push(`/payment?listingId=${listing.id}`)
            }
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
          >
            Rent This Item
          </button>
        </div>
      </div>
    </div>
  );
}
