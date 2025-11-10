"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal, MapPin, Calendar, DollarSign } from 'lucide-react';

export default function ListingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data - replace with API call to Django backend
  const listings = [
    {
      id: 1,
      title: 'Professional DSLR Camera',
      price: 50,
      period: 'day',
      location: 'Nairobi, Kenya',
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
      category: 'Electronics',
      owner: 'John Doe',
      rating: 4.8
    },
    {
      id: 2,
      title: 'Power Drill Set',
      price: 15,
      period: 'day',
      location: 'Westlands, Nairobi',
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
      category: 'Tools',
      owner: 'Jane Smith',
      rating: 5.0
    },
    {
      id: 3,
      title: 'Camping Tent (4 Person)',
      price: 30,
      period: 'day',
      location: 'Karen, Nairobi',
      image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400&h=300&fit=crop',
      category: 'Outdoor',
      owner: 'Mike Johnson',
      rating: 4.5
    },
    {
      id: 4,
      title: 'PlayStation 5',
      price: 25,
      period: 'day',
      location: 'CBD, Nairobi',
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=300&fit=crop',
      category: 'Electronics',
      owner: 'Sarah Wilson',
      rating: 4.9
    },
    {
      id: 5,
      title: 'Lawn Mower',
      price: 20,
      period: 'day',
      location: 'Kilimani, Nairobi',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      category: 'Tools',
      owner: 'David Brown',
      rating: 4.7
    },
    {
      id: 6,
      title: 'Mountain Bike',
      price: 35,
      period: 'day',
      location: 'Parklands, Nairobi',
      image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400&h=300&fit=crop',
      category: 'Sports',
      owner: 'Emma Davis',
      rating: 4.6
    },
    {
      id: 7,
      title: 'Projector & Screen',
      price: 40,
      period: 'day',
      location: 'Upperhill, Nairobi',
      image: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=400&h=300&fit=crop',
      category: 'Electronics',
      owner: 'Chris Lee',
      rating: 4.8
    },
    {
      id: 8,
      title: 'Party Tent & Chairs',
      price: 100,
      period: 'day',
      location: 'Lavington, Nairobi',
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop',
      category: 'Events',
      owner: 'Lisa Anderson',
      rating: 5.0
    }
  ];

  const categories = ['all', 'Electronics', 'Tools', 'Outdoor', 'Sports', 'Events'];

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || listing.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
                className="pl-10 border-black focus:ring-black"
              />
            </div>

            {/* Filter Button */}
            <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white">
              <SlidersHorizontal size={20} className="mr-2" />
              Filters
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredListings.map((listing) => (
            <Card
              key={listing.id}
              className="border-2 border-black shadow-none hover:shadow-lg transition-shadow cursor-pointer"
            >
              <CardContent className="p-0">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-white px-2 py-1 border border-black text-xs font-bold">
                    {listing.category}
                  </div>
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
                      <span className="text-sm text-gray-600">/{listing.period}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm">★</span>
                      <span className="text-sm font-bold">{listing.rating}</span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mb-3">
                    Owner: <span className="font-medium text-black">{listing.owner}</span>
                  </div>

                  <Button className="w-full bg-black text-white hover:bg-gray-800">
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
