"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Search, SlidersHorizontal, MapPin, Calendar, DollarSign, X, Phone, Mail, User, UserCircle } from 'lucide-react';
import { listingsAPI } from '@/lib/api';
import { Listing } from '@/types/listing';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';

export default function ListingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Rent modal state
  const [rentOpenForId, setRentOpenForId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [rentLoading, setRentLoading] = useState<boolean>(false);
  const [rentError, setRentError] = useState<string>('');
  const [rentSuccess, setRentSuccess] = useState<string>('');

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

  // Fetch listings from API
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await listingsAPI.getListings({ is_active: true });
        // Handle both paginated (response.results) and non-paginated (direct array) responses
        const listingsData = Array.isArray(response) ? response : (response.results || []);
        setListings(listingsData);

        // // Using mock data for development
        // setListings(mockListings);
      } catch (err: any) {
        setError(err.message || 'Failed to load listings');
        console.error('Error fetching listings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Mock data for fallback (will be removed once API works)
  const mockListings = [
    {
      id: 1,
      title: 'Professional DSLR Camera',
      price: 5000, // KES
      period: 'day',
      location: 'Nairobi, Kenya',
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
      category: 'Electronics',
      owner: 'Kevin Mwangi',
      rating: 4.8,
      phone: '+254 712 345 678',
      email: 'kevin.mwangi@email.com',
      description: 'Professional Canon DSLR camera with multiple lenses. Perfect for events, photoshoots, and professional photography. Comes with camera bag and accessories.'
    },
    {
      id: 2,
      title: 'Power Drill Set',
      price: 1500, // KES
      period: 'day',
      location: 'Westlands, Nairobi',
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
      category: 'Tools',
      owner: 'Grace Wanjiku',
      rating: 5.0,
      phone: '+254 723 456 789',
      email: 'grace.wanjiku@email.com',
      description: 'Complete power drill set with various drill bits and accessories. Ideal for home improvement and DIY projects.'
    },
    {
      id: 3,
      title: 'Camping Tent (4 Person)',
      price: 3000, // KES
      period: 'day',
      location: 'Karen, Nairobi',
      image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400&h=300&fit=crop',
      category: 'Outdoor',
      owner: 'Brian Otieno',
      rating: 4.5
    },
    {
      id: 4,
      title: 'PlayStation 5',
      price: 2500, // KES
      period: 'day',
      location: 'CBD, Nairobi',
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=300&fit=crop',
      category: 'Electronics',
      owner: 'Faith Njeri',
      rating: 4.9
    },
    {
      id: 5,
      title: 'Lawn Mower',
      price: 2000, // KES
      period: 'day',
      location: 'Kilimani, Nairobi',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      category: 'Tools',
      owner: 'Samuel Karanja',
      rating: 4.7
    },
    {
      id: 6,
      title: 'Mountain Bike',
      price: 3500, // KES
      period: 'day',
      location: 'Parklands, Nairobi',
      image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400&h=300&fit=crop',
      category: 'Sports',
      owner: 'Aisha Mohamed',
      rating: 4.6
    },
    {
      id: 7,
      title: 'Projector & Screen',
      price: 4000, // KES
      period: 'day',
      location: 'Upperhill, Nairobi',
      image: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=400&h=300&fit=crop',
      category: 'Electronics',
      owner: 'Dennis Mworia',
      rating: 4.8
    },
    {
      id: 8,
      title: 'Party Tent & Chairs',
      price: 10000, // KES
      period: 'day',
      location: 'Lavington, Nairobi',
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop',
      category: 'Events',
      owner: 'Ruth Wambui',
      rating: 5.0
    },
    {
      id: 9,
      title: 'DJ Equipment Set',
      price: 8000, // KES
      period: 'day',
      location: 'South B, Nairobi',
      image: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=300&fit=crop',
      category: 'Electronics',
      owner: 'Mike Odhiambo',
      rating: 4.9
    },
    {
      id: 10,
      title: 'Generator 5KVA',
      price: 5000, // KES
      period: 'day',
      location: 'Industrial Area, Nairobi',
      image: 'https://images.unsplash.com/photo-1615495001865-e4e7222015f2?w=400&h=300&fit=crop',
      category: 'Tools',
      owner: 'John Mutua',
      rating: 4.6
    },
    {
      id: 11,
      title: 'Wedding Dress',
      price: 7000, // KES
      period: 'day',
      location: 'Ngong Road, Nairobi',
      image: 'https://images.unsplash.com/photo-1594552072238-ae9ac3a3f34b?w=400&h=300&fit=crop',
      category: 'Events',
      owner: 'Mary Akinyi',
      rating: 5.0
    },
    {
      id: 12,
      title: 'Gaming Laptop',
      price: 3500, // KES
      period: 'day',
      location: 'Gigiri, Nairobi',
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=300&fit=crop',
      category: 'Electronics',
      owner: 'David Kamau',
      rating: 4.8
    },
    {
      id: 13,
      title: 'Kayak (Single)',
      price: 2500, // KES
      period: 'day',
      location: 'Runda, Nairobi',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
      category: 'Outdoor',
      owner: 'Jane Wangui',
      rating: 4.7
    },
    {
      id: 14,
      title: 'Ladder Extension 20ft',
      price: 1200, // KES
      period: 'day',
      location: 'Embakasi, Nairobi',
      image: 'https://images.unsplash.com/photo-1609779883228-259e3e1a0aac?w=400&h=300&fit=crop',
      category: 'Tools',
      owner: 'Peter Njenga',
      rating: 4.5
    },
    {
      id: 15,
      title: 'Pressure Washer',
      price: 2000, // KES
      period: 'day',
      location: 'Thika Road, Nairobi',
      image: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=400&h=300&fit=crop',
      category: 'Tools',
      owner: 'James Kimani',
      rating: 4.8
    },
    {
      id: 16,
      title: 'Road Bike',
      price: 3000, // KES
      period: 'day',
      location: 'Muthaiga, Nairobi',
      image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=300&fit=crop',
      category: 'Sports',
      owner: 'Lucy Chebet',
      rating: 4.9
    },
    {
      id: 17,
      title: 'VR Headset',
      price: 4000, // KES
      period: 'day',
      location: 'Westlands, Nairobi',
      image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400&h=300&fit=crop',
      category: 'Electronics',
      owner: 'Steve Omondi',
      rating: 4.7
    },
    {
      id: 18,
      title: 'Camping Stove & Cookware',
      price: 1500, // KES
      period: 'day',
      location: 'Langata, Nairobi',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
      category: 'Outdoor',
      owner: 'Alice Nyambura',
      rating: 4.6
    },
    {
      id: 19,
      title: 'Folding Tables (5pc)',
      price: 3000, // KES
      period: 'day',
      location: 'Donholm, Nairobi',
      image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=400&h=300&fit=crop',
      category: 'Events',
      owner: 'George Kipchoge',
      rating: 4.4
    },
    {
      id: 20,
      title: 'Electric Scooter',
      price: 2000, // KES
      period: 'day',
      location: 'Kileleshwa, Nairobi',
      image: 'https://images.unsplash.com/photo-1559311859-c6ef2031d4cd?w=400&h=300&fit=crop',
      category: 'Sports',
      owner: 'Rose Wafula',
      rating: 4.8
    },
    {
      id: 21,
      title: 'Professional Drone',
      price: 6000, // KES
      period: 'day',
      location: 'Spring Valley, Nairobi',
      image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=300&fit=crop',
      category: 'Electronics',
      owner: 'Tom Muthomi',
      rating: 5.0
    },
    {
      id: 22,
      title: 'Inflatable Bounce House',
      price: 15000, // KES
      period: 'day',
      location: 'Kitisuru, Nairobi',
      image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&h=300&fit=crop',
      category: 'Events',
      owner: 'Nancy Wairimu',
      rating: 4.9
    },
    {
      id: 23,
      title: 'Carpet Cleaner Machine',
      price: 2500, // KES
      period: 'day',
      location: 'South C, Nairobi',
      image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400&h=300&fit=crop',
      category: 'Tools',
      owner: 'Patrick Onyango',
      rating: 4.5
    },
    {
      id: 24,
      title: 'Telescope',
      price: 3500, // KES
      period: 'day',
      location: 'Ridgeways, Nairobi',
      image: 'https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700?w=400&h=300&fit=crop',
      category: 'Outdoor',
      owner: 'Vincent Kiprop',
      rating: 4.7
    },
    {
      id: 25,
      title: 'Sewing Machine Industrial',
      price: 2000, // KES
      period: 'day',
      location: 'Eastleigh, Nairobi',
      image: 'https://images.unsplash.com/photo-1597081916528-2ee6d87b1f4e?w=400&h=300&fit=crop',
      category: 'Tools',
      owner: 'Susan Nduta',
      rating: 4.6
    },
    {
      id: 26,
      title: 'Sound System PA',
      price: 9000, // KES
      period: 'day',
      location: 'Syokimau, Nairobi',
      image: 'https://images.unsplash.com/photo-1563330232-57114bb0823c?w=400&h=300&fit=crop',
      category: 'Electronics',
      owner: 'Joseph Gitau',
      rating: 4.8
    },
    {
      id: 27,
      title: 'Wheelchair',
      price: 1000, // KES
      period: 'day',
      location: 'Buruburu, Nairobi',
      image: 'https://images.unsplash.com/photo-1569315437190-c715e1aa0d54?w=400&h=300&fit=crop',
      category: 'Tools',
      owner: 'Margaret Juma',
      rating: 5.0
    },
    {
      id: 28,
      title: 'Stand Up Paddleboard',
      price: 3500, // KES
      period: 'day',
      location: 'Rosslyn, Nairobi',
      image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=400&h=300&fit=crop',
      category: 'Sports',
      owner: 'Angela Mwende',
      rating: 4.6
    },
    {
      id: 29,
      title: 'Party Lights LED',
      price: 4500, // KES
      period: 'day',
      location: 'Kilimani, Nairobi',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=300&fit=crop',
      category: 'Events',
      owner: 'Charles Ochieng',
      rating: 4.7
    },
    {
      id: 30,
      title: 'Electric Guitar & Amp',
      price: 3000, // KES
      period: 'day',
      location: 'Ngara, Nairobi',
      image: 'https://images.unsplash.com/photo-1511735643442-503bb3bd348a?w=400&h=300&fit=crop',
      category: 'Electronics',
      owner: 'Henry Ndungu',
      rating: 4.9
    },
    {
      id: 31,
      title: 'Barbecue Grill Large',
      price: 2500, // KES
      period: 'day',
      location: 'Rongai, Nairobi',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
      category: 'Outdoor',
      owner: 'Philip Wekesa',
      rating: 4.5
    },
    {
      id: 32,
      title: 'Baby Stroller Premium',
      price: 1500, // KES
      period: 'day',
      location: 'Ruaka, Nairobi',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
      category: 'Tools',
      owner: 'Christine Auma',
      rating: 4.8
    },
    {
      id: 33,
      title: 'Treadmill',
      price: 2500, // KES
      period: 'day',
      location: 'Kikuyu, Nairobi',
      image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=400&h=300&fit=crop',
      category: 'Sports',
      owner: 'Eric Njoroge',
      rating: 4.7
    },
    {
      id: 34,
      title: 'Photo Booth Kit',
      price: 8000, // KES
      period: 'day',
      location: 'Kasarani, Nairobi',
      image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop',
      category: 'Events',
      owner: 'Sarah Wangari',
      rating: 5.0
    },
    {
      id: 35,
      title: 'Chainsaw',
      price: 3000, // KES
      period: 'day',
      location: 'Ngong, Nairobi',
      image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop',
      category: 'Tools',
      owner: 'William Bett',
      rating: 4.6
    },
    {
      id: 36,
      title: 'GoPro Action Camera',
      price: 4000, // KES
      period: 'day',
      location: 'Yaya Centre, Nairobi',
      image: 'https://images.unsplash.com/photo-1585508889406-bd8301f1b7f6?w=400&h=300&fit=crop',
      category: 'Electronics',
      owner: 'Caroline Moraa',
      rating: 4.9
    },
    {
      id: 37,
      title: 'Fishing Rod & Tackle',
      price: 1800, // KES
      period: 'day',
      location: 'Limuru, Nairobi',
      image: 'https://images.unsplash.com/photo-1545450660-1c0d6d38b21c?w=400&h=300&fit=crop',
      category: 'Outdoor',
      owner: 'Daniel Korir',
      rating: 4.4
    },
    {
      id: 38,
      title: 'Fog Machine',
      price: 5000, // KES
      period: 'day',
      location: 'Parklands, Nairobi',
      image: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=400&h=300&fit=crop',
      category: 'Events',
      owner: 'Francis Maina',
      rating: 4.8
    }
  ];

  const categories = ['all', 'Electronics', 'Tools', 'Outdoor', 'Sports', 'Events'];

  // Extract unique locations from listings
  const locations = listings && listings.length > 0
    ? ['all', ...Array.from(new Set(listings.map(l => l.location)))]
    : ['all'];

  const filteredListings = (listings || []).filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || listing.category === selectedCategory;
    const matchesLocation = selectedLocation === 'all' || listing.location === selectedLocation;
    const matchesPrice = listing.price >= priceRange[0] && listing.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesLocation && matchesPrice;
  });

  const resetRentState = () => {
    setStartDate('');
    setEndDate('');
    setRentError('');
    setRentSuccess('');
    setRentLoading(false);
  };

  const checkAvailability = async (listingId: number) => {
    const params = new URLSearchParams({
      listing_id: String(listingId),
      start_date: startDate,
      end_date: endDate,
    });
    const res = await fetch(`${API_BASE_URL}/bookings/availability/check_availability/?${params.toString()}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to check availability');
    }
    return res.json();
  };

  const createBooking = async (listingId: number) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token) {
      throw new Error('Please sign in to rent an item');
    }
    const res = await fetch(`${API_BASE_URL}/bookings/bookings/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        listing: listingId,
        start_date: startDate,
        end_date: endDate,
        notes: '',
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      // DRF validation error shape
      const msg = err?.dates || err?.start_date || err?.end_date || err?.detail || Object.values(err)?.[0] || 'Failed to create booking';
      throw new Error(Array.isArray(msg) ? msg[0] : String(msg));
    }
    return res.json();
  };

  const handleRent = async (listingId: number) => {
    setRentLoading(true);
    setRentError('');
    setRentSuccess('');
    try {
      if (!startDate || !endDate) {
        throw new Error('Please select start and end dates');
      }
      const avail = await checkAvailability(listingId);
      if (!avail?.available) {
        throw new Error('Selected dates are not available');
      }
      const booking = await createBooking(listingId);
      setRentSuccess('Booking created successfully! Total price: KES ' + booking.total_price);
      // Reset form after successful booking
      setTimeout(() => {
        setRentOpenForId(null);
        resetRentState();
      }, 2000);
    } catch (e: any) {
      setRentError(e.message || 'Failed to rent item');
    } finally {
      setRentLoading(false);
    }
  };

  const handleProfileClick = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token) {
      window.location.href = '/signup';
    } else {
      window.location.href = '/profile';
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-[#FFB700]">
        {/* Sidebar */}
        <Sidebar side="left" collapsible="offcanvas">

          <SidebarContent>
            {/* Search */}
            <SidebarGroup>
              <SidebarGroupContent>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Categories */}
            <SidebarGroup>
              <SidebarGroupLabel className='text-black font-bold'>Categories</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="flex flex-col gap-1 px-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-2 rounded-md text-left text-sm transition-colors ${selectedCategory === category
                        ? 'bg-[#FFB700] text-white'
                        : 'hover:bg-gray-100'
                        }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Locations */}
            <SidebarGroup>
              <SidebarGroupLabel className='font-bold text-black'>
                Locations
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <ScrollArea className="h-48">
                  <div className="flex flex-col gap-1 px-2">
                    {locations.map((location) => (
                      <button
                        key={location}
                        onClick={() => setSelectedLocation(location)}
                        className={`px-3 py-2 rounded-md text-left text-sm transition-colors ${selectedLocation === location
                          ? 'bg-[#FFB700] text-white'
                          : 'hover:bg-gray-100'
                          }`}
                      >
                        {location === 'all' ? 'All Locations' : location}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Price Range */}
            <SidebarGroup>
              <SidebarGroupLabel>Price Range (KES)</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-4 py-2">
                  <Slider
                    min={0}
                    max={20000}
                    step={500}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>{priceRange[0]} KES</span>
                    <span>{priceRange[1]} KES</span>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-black p-4">
            <Button
              onClick={handleProfileClick}
              variant="outline"
              className="w-full border-0 rounded-md text-black hover:bg-[#ffaa1d] hover:text-white"
            >
              <UserCircle size={18} className="mr-2" />
              Profile
            </Button>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <SidebarInset className="flex-1 bg-[#FFB700] min-h-screen">
          {/* Header */}
          <header className="sticky top-0 bg-[#FFB700] z-10">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <SidebarTrigger />
                  <a href="/listings" className="text-2xl font-bold text-black">RentMe</a>
                </div>
                <div className="relative px-4 w-full">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    type="text"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 border-0 rounded-full h-12 bg-white"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <Button variant="outline" className="text-black hover:bg-[#FFB700] hover:text-white">
                    <a href="/post-items">Post Item</a>
                  </Button>
                  <Button variant="outline" className='text-black hover:bg-[#FFB700] hover:text-white'>
                    <Link href="/cart">
                      <ShoppingCart />
                    </Link>

                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Listings Grid */}
          <div className=" px-4 py-8 bg-[#FFB700]">
            {filteredListings.length > 0 ? (
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">

                {filteredListings.map((listing) => (
                  <Card
                    key={listing.id}
                    className="bg-white shadow-none hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <CardContent className="p-0">
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={listing.image || '/placeholder-image.jpg'}
                          alt={listing.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-white px-2 py-1 border border-black text-xs font-bold">{listing.category}</div>
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
                            <p>KES</p>
                            <span className="text-xl font-bold">{listing.price}</span>
                            <span className="text-sm text-gray-600">/{listing.price_period}</span>
                          </div>
                          {listing.rating && (
                            <div className="flex items-center gap-1">
                              <span className="text-sm">Ôÿà</span>
                              <span className="text-sm font-bold">{listing.rating}</span>
                            </div>
                          )}
                        </div>

                        <div className="text-sm text-gray-600 mb-3">
                          Owner: <span className="font-medium text-black">{typeof listing.owner === 'object' ? `${listing.owner.first_name} ${listing.owner.last_name}`.trim() || listing.owner.username : listing.owner}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">

                          <Button
                            variant="outline"
                            className="w-full text-black hover:bg-[#FFB700] hover:text-white:width,"
                            onClick={() => {
                              setSelectedListing(listing);
                              setIsModalOpen(true);
                            }}
                          >
                            View
                          </Button>
                          <Button
                            variant='outline'
                            className="w-full bg-white text-black hover:bg-[#FFB700]"
                            onClick={() => {
                              setRentOpenForId(listing.id);
                              resetRentState();
                            }}
                          >
                            Rent
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">No items found</h3>
                  <p className="text-gray-600">Try adjusting your search or filters</p>
                </div>
              </div>
            )}
          </div>

          {/* Modals */}
          {/* Item Details Modal */}
          {isModalOpen && selectedListing && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
              <div className="bg-white max-w-2xl w-full max-h-[90vh] flex flex-col rounded-md">
                {/* Modal Header */}
                <div className="bg-white  p-4 flex items-center justify-between flex-shrink-0">
                  <h2 className="text-2xl font-bold text-black">Item Details</h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-black"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto">
                  {/* Image */}
                  <div className="relative h-64 mb-6 overflow-hidden rounded-lg">
                    <img
                      src={selectedListing.image || '/placeholder-image.jpg'}
                      alt={selectedListing.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-white px-3 py-1 text-sm font-bold border border-black">
                      {selectedListing.category}
                    </div>
                  </div>

                  {/* Title and Rating */}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-2xl font-bold flex-1 text-black">{selectedListing.title}</h3>
                    {selectedListing.rating && (
                      <div className="flex items-center gap-1 ml-4">
                        <span className="text-lg">Ôÿà</span>
                        <span className="text-lg font-bold text-black">{selectedListing.rating}</span>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mb-6 p-4 border-2 border-black bg-white rounded-lg">
                    <div className="flex items-center gap-2">
                      <DollarSign size={24} />
                      <span className="text-3xl font-bold">{selectedListing.price} KES</span>
                      <span className="text-xl text-gray-600">/ {selectedListing.price_period}</span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin size={20} />
                      <span className="text-lg text-black">{selectedListing.location}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <h4 className="font-bold text-lg mb-2 text-black">Description</h4>
                    <p className="text-gray-700">
                      {selectedListing.description || 'No description available for this item.'}
                    </p>
                  </div>

                  {/* Owner Information */}
                  <div className="border-2 border-black p-4 mb-6 rounded-lg bg-white">
                    <h4 className="font-bold text-lg mb-4 text-black">Contact Owner</h4>

                    <div className="space-y-3">
                      {/* Owner Name */}
                      <div className="flex items-center gap-3">
                        <User size={20} />
                        <div>
                          <p className="text-sm text-gray-600">Owner</p>
                          <p className="font-bold text-black">{typeof selectedListing.owner === 'object' ? `${selectedListing.owner.first_name} ${selectedListing.owner.last_name}`.trim() || selectedListing.owner.username : selectedListing.owner}</p>
                        </div>
                      </div>

                      {/* Phone */}
                      {selectedListing.phone && (
                        <div className="flex items-center gap-3">
                          <Phone size={20} />
                          <div>
                            <p className="text-sm text-gray-600">Phone</p>
                            <a
                              href={`tel:${selectedListing.phone}`}
                              className="font-bold text-black hover:text-black hover:underline transition-colors"
                            >
                              {selectedListing.phone}
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Email */}
                      {(typeof selectedListing.owner === 'object' && selectedListing.owner.email) && (
                        <div className="flex items-center gap-3">
                          <Mail size={20} />
                          <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <a
                              href={`mailto:${typeof selectedListing.owner === 'object' ? selectedListing.owner.email : ''}`}
                              className="font-bold text-black hover:text-black hover:underline transition-colors"
                            >
                              {typeof selectedListing.owner === 'object' ? selectedListing.owner.email : ''}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      className="flex-1 border-black text-black hover:bg-black hover:text-white"
                      onClick={() => {
                        if (selectedListing.phone) {
                          window.location.href = `tel:${selectedListing.phone}`;
                        }
                      }}
                    >
                      <Phone size={18} className="mr-2" />
                      Call Owner
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-black text-black hover:bg-black hover:text-white"
                      onClick={() => {
                        const email = typeof selectedListing.owner === 'object' ? selectedListing.owner.email : null;
                        if (email) {
                          window.location.href = `mailto:${email}`;
                        }
                      }}
                    >
                      <Mail size={18} className="mr-2" />
                      Send Email
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rent Modal (simple inline overlay) */}
          {rentOpenForId !== null && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-md p-5">
                <h3 className="text-xl font-bold mb-1">Rent Item</h3>
                <p className="text-sm text-gray-600 mb-4">Select dates to rent this item.</p>

                {rentError && (
                  <div className="mb-3 p-2 border border-red-300 bg-red-50 text-red-700 text-sm">
                    {rentError}
                  </div>
                )}
                {rentSuccess && (
                  <div className="mb-3 p-2 border border-green-300 bg-green-50 text-green-700 text-sm">
                    {rentSuccess}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Start date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="pl-10 border-black"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="pl-10 border-black"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="bg-black text-white hover:bg-gray-800"
                    disabled={rentLoading}
                    onClick={() => handleRent(rentOpenForId!)}
                  >
                    {rentLoading ? 'Processing...' : 'Confirm Rent'}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-black text-black hover:bg-black hover:text-white"
                    onClick={() => setRentOpenForId(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
