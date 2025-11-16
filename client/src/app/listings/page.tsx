"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal, MapPin, DollarSign } from 'lucide-react';
import { listingsAPI } from '@/lib/api';

interface Listing {
  id: number;
  title: string;
  price: string;
  price_period: string;
  location: string;
  primary_image: string | null;
  category: string;
  owner: {
    username: string;
    first_name?: string;
    last_name?: string;
  };
  average_rating: string;
  is_available_for_rent: boolean;
}

export default function ListingsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = ['all', 'Electronics', 'Tools', 'Outdoor', 'Sports', 'Events', 'Vehicles', 'Home & Garden', 'Photography', 'Music', 'Other'];

  useEffect(() => {
    fetchListings();
  }, [selectedCategory]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: any = {};
      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }
      const data = await listingsAPI.getListings(params);
      setListings(data.results || data);
    } catch (err: any) {
      console.error('Error fetching listings:', err);
      setError('Failed to load listings. Please try again.');
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchListings();
  };

  const filteredListings = listings.filter(listing => {
    if (selectedCategory !== 'all' && listing.category !== selectedCategory) {
      return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return listing.title.toLowerCase().includes(query) ||
        listing.location.toLowerCase().includes(query);
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-bold mb-2">Loading listings...</div>
          <div className="text-gray-600">Please wait</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-black sticky top-0 bg-white z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="text-2xl font-bold">RentMe</a>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white">
                <a href="/post-items">Post Item</a>
              </Button>
              <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white">
                <a href="/profile">Profile</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filters Section */}
      <div className="border-b border-black">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search items or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 border-black focus:ring-black"
              />
            </div>

            {/* Search Button */}
            <Button 
              variant="outline" 
              className="border-black text-black hover:bg-black hover:text-white"
              onClick={handleSearch}
            >
              <Search size={20} className="mr-2" />
              Search
            </Button>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full border-2 whitespace-nowrap transition-colors ${selectedCategory === category
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-black hover:bg-gray-100'
                  }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {filteredListings.length} {filteredListings.length === 1 ? 'Item' : 'Items'} Available
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredListings.map((listing) => (
            <Card
              key={listing.id}
              className="border-2 border-black shadow-none hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/listings/${listing.id}`)}
            >
              <CardContent className="p-0">
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  {listing.primary_image ? (
                    <img
                      src={listing.primary_image}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-white px-2 py-1 border border-black text-xs font-bold">
                    {listing.category}
                  </div>
                  {!listing.is_available_for_rent && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-bold">
                      Unavailable
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">{listing.title}</h3>

                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                    <MapPin size={14} />
                    <span className="line-clamp-1">{listing.location}</span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      <DollarSign size={18} className="font-bold" />
                      <span className="text-xl font-bold">{listing.price}</span>
                      <span className="text-sm text-gray-600">/{listing.price_period}</span>
                    </div>
                    {listing.average_rating && parseFloat(listing.average_rating) > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-sm">★</span>
                        <span className="text-sm font-bold">{parseFloat(listing.average_rating).toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-sm text-gray-600 mb-3">
                    Owner: <span className="font-medium text-black">
                      {listing.owner.first_name && listing.owner.last_name
                        ? `${listing.owner.first_name} ${listing.owner.last_name}`
                        : listing.owner.username}
                    </span>
                  </div>

                  <Button 
                    className="w-full bg-black text-white hover:bg-gray-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/listings/${listing.id}`);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold mb-2">No items found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
