// app/listings/page.tsx
"use client";
import React, { useRef, useState, useMemo } from "react";
import Link from "next/link";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

<<<<<<< HEAD
/**
 * Rental Listings Page for RentMe
 * Displays available items for rent with filtering and browsing capabilities
 */

const SAMPLE_LISTINGS = [
  // Electronics
  { id: 1, category: "Electronics", title: "Professional DSLR Camera", price: 6500, rating: 4.8, reviews: 32, location: "Westlands", image: 0 },
  { id: 2, category: "Electronics", title: "4K Projector with Screen", price: 8450, rating: 4.7, reviews: 28, location: "Gigiri", image: 0 },
  { id: 3, category: "Electronics", title: "Drone with 4K Camera", price: 9750, rating: 4.9, reviews: 51, location: "Upper Hill", image: 0 },
  { id: 4, category: "Electronics", title: "Sony Mirrorless Camera", price: 9100, rating: 4.8, reviews: 45, location: "Kilimani", image: 0 },
  { id: 5, category: "Electronics", title: "Gaming Laptop", price: 7150, rating: 4.8, reviews: 38, location: "Gigiri", image: 0 },
  { id: 6, category: "Electronics", title: "DJ Equipment Set", price: 10400, rating: 4.9, reviews: 42, location: "South B", image: 0 },
  { id: 7, category: "Electronics", title: "VR Headset", price: 5200, rating: 4.7, reviews: 25, location: "Westlands", image: 0 },
  { id: 8, category: "Electronics", title: "Sound System PA", price: 11700, rating: 4.8, reviews: 35, location: "Syokimau", image: 0 },
  { id: 9, category: "Electronics", title: "Electric Guitar & Amp", price: 7800, rating: 4.9, reviews: 28, location: "Ngara", image: 0 },
  { id: 10, category: "Electronics", title: "GoPro Action Camera", price: 5850, rating: 4.9, reviews: 41, location: "Yaya Centre", image: 0 },
=======
import { useState, useEffect } from 'react';
import Link from 'next/Link';
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
>>>>>>> b95c47ee75927bbf54af7c3daf388c6962ce273a

  // Tools
  { id: 11, category: "Tools", title: "Power Drill Set", price: 1950, rating: 5.0, reviews: 22, location: "Westlands", image: 0 },
  { id: 12, category: "Tools", title: "Lawn Mower", price: 2600, rating: 4.7, reviews: 19, location: "Kilimani", image: 0 },
  { id: 13, category: "Tools", title: "Generator 5KVA", price: 6500, rating: 4.6, reviews: 30, location: "Industrial Area", image: 0 },
  { id: 14, category: "Tools", title: "Ladder Extension 20ft", price: 1560, rating: 4.5, reviews: 14, location: "Embakasi", image: 0 },
  { id: 15, category: "Tools", title: "Pressure Washer", price: 2600, rating: 4.8, reviews: 26, location: "Thika Road", image: 0 },
  { id: 16, category: "Tools", title: "Carpet Cleaner Machine", price: 3250, rating: 4.5, reviews: 18, location: "South C", image: 0 },
  { id: 17, category: "Tools", title: "Sewing Machine Industrial", price: 2600, rating: 4.6, reviews: 16, location: "Eastleigh", image: 0 },
  { id: 18, category: "Tools", title: "Chainsaw", price: 3900, rating: 4.6, reviews: 20, location: "Ngong", image: 0 },
  { id: 19, category: "Tools", title: "Baby Stroller Premium", price: 1950, rating: 4.8, reviews: 24, location: "Ruaka", image: 0 },
  { id: 20, category: "Tools", title: "Wheelchair", price: 1300, rating: 5.0, reviews: 17, location: "Buruburu", image: 0 },

  // Sports
  { id: 21, category: "Sports", title: "Mountain Bike", price: 4550, rating: 4.6, reviews: 28, location: "Parklands", image: 0 },
  { id: 22, category: "Sports", title: "Road Bike", price: 3900, rating: 4.9, reviews: 33, location: "Muthaiga", image: 0 },
  { id: 23, category: "Sports", title: "Electric Scooter", price: 2600, rating: 4.8, reviews: 29, location: "Kileleshwa", image: 0 },
  { id: 24, category: "Sports", title: "Stand Up Paddleboard", price: 4550, rating: 4.6, reviews: 21, location: "Rosslyn", image: 0 },
  { id: 25, category: "Sports", title: "Treadmill", price: 3250, rating: 4.7, reviews: 27, location: "Kikuyu", image: 0 },
  { id: 26, category: "Sports", title: "Kayak Single", price: 3250, rating: 4.7, reviews: 23, location: "Runda", image: 0 },
  { id: 27, category: "Sports", title: "Fishing Rod & Tackle Set", price: 2340, rating: 4.4, reviews: 15, location: "Limuru", image: 0 },
  { id: 28, category: "Sports", title: "Tennis Racket Set", price: 1950, rating: 4.6, reviews: 19, location: "Kilimani", image: 0 },
  { id: 29, category: "Sports", title: "Skateboard Pro", price: 1560, rating: 4.5, reviews: 11, location: "CBD", image: 0 },
  { id: 30, category: "Sports", title: "Rock Climbing Gear", price: 5200, rating: 4.8, reviews: 25, location: "Karen", image: 0 },

<<<<<<< HEAD
  // Outdoor
  { id: 31, category: "Outdoor", title: "Camping Tent 4 Person", price: 3900, rating: 4.5, reviews: 24, location: "Karen", image: 0 },
  { id: 32, category: "Outdoor", title: "Camping Stove & Cookware", price: 1950, rating: 4.6, reviews: 20, location: "Langata", image: 0 },
  { id: 33, category: "Outdoor", title: "Telescope", price: 4550, rating: 4.7, reviews: 18, location: "Ridgeways", image: 0 },
  { id: 34, category: "Outdoor", title: "Barbecue Grill Large", price: 3250, rating: 4.5, reviews: 16, location: "Rongai", image: 0 },
  { id: 35, category: "Outdoor", title: "Hiking Backpack Pro", price: 2600, rating: 4.7, reviews: 22, location: "Gigiri", image: 0 },
  { id: 36, category: "Outdoor", title: "Sleeping Bag Winter", price: 1560, rating: 4.6, reviews: 14, location: "Westlands", image: 0 },
  { id: 37, category: "Outdoor", title: "Portable Cooler", price: 2340, rating: 4.4, reviews: 13, location: "Karen", image: 0 },
  { id: 38, category: "Outdoor", title: "Binoculars Professional", price: 3640, rating: 4.8, reviews: 19, location: "Upper Hill", image: 0 },
  { id: 39, category: "Outdoor", title: "Camping Lantern LED", price: 1300, rating: 4.5, reviews: 17, location: "Parklands", image: 0 },
  { id: 40, category: "Outdoor", title: "Hammock with Stand", price: 2860, rating: 4.7, reviews: 26, location: "Spring Valley", image: 0 },
=======
  // Fetch listings from API
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError(null);
        // const response = await listingsAPI.getListings({ is_active: true });
        // setListings(response.results);

        // Using mock data for development
        setListings(mockListings);
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
>>>>>>> b95c47ee75927bbf54af7c3daf388c6962ce273a

  // Events
  { id: 41, category: "Events", title: "Party Tent & Chairs", price: 13000, rating: 5.0, reviews: 35, location: "Lavington", image: 0 },
  { id: 42, category: "Events", title: "Wedding Dress", price: 9100, rating: 5.0, reviews: 28, location: "Ngong Road", image: 0 },
  { id: 43, category: "Events", title: "Folding Tables 5pc", price: 3900, rating: 4.4, reviews: 12, location: "Donholm", image: 0 },
  { id: 44, category: "Events", title: "Inflatable Bounce House", price: 19500, rating: 4.9, reviews: 31, location: "Kitisuru", image: 0 },
  { id: 45, category: "Events", title: "Party Lights LED", price: 5850, rating: 4.7, reviews: 21, location: "Kilimani", image: 0 },
  { id: 46, category: "Events", title: "Photo Booth Kit", price: 10400, rating: 5.0, reviews: 29, location: "Kasarani", image: 0 },
  { id: 47, category: "Events", title: "Fog Machine", price: 6500, rating: 4.8, reviews: 24, location: "Parklands", image: 0 },
  { id: 48, category: "Events", title: "Wedding Arch & Backdrop", price: 15600, rating: 4.9, reviews: 26, location: "Runda", image: 0 },
  { id: 49, category: "Events", title: "Catering Equipment Set", price: 26000, rating: 4.7, reviews: 19, location: "CBD", image: 0 },
  { id: 50, category: "Events", title: "Flower Decoration Kit", price: 5200, rating: 4.6, reviews: 15, location: "Karen", image: 0 },

<<<<<<< HEAD
  // Furniture
  { id: 51, category: "Furniture", title: "Modern Standing Desk", price: 10400, rating: 4.6, reviews: 18, location: "Karen", image: 0 },
  { id: 52, category: "Furniture", title: "Ergonomic Office Chair", price: 5200, rating: 4.5, reviews: 15, location: "Parklands", image: 0 },
  { id: 53, category: "Furniture", title: "Gaming Desk Setup", price: 12350, rating: 4.7, reviews: 22, location: "Spring Valley", image: 0 },
  { id: 54, category: "Furniture", title: "Adjustable Bookshelf Unit", price: 6500, rating: 4.4, reviews: 12, location: "Runda", image: 0 },
  { id: 55, category: "Furniture", title: "Office Sofa Leather", price: 15600, rating: 4.8, reviews: 26, location: "Westlands", image: 0 },
  { id: 56, category: "Furniture", title: "Dining Table Set 6pc", price: 19500, rating: 4.6, reviews: 20, location: "Karen", image: 0 },
  { id: 57, category: "Furniture", title: "Office Cabinet Wooden", price: 7800, rating: 4.5, reviews: 14, location: "CBD", image: 0 },
  { id: 58, category: "Furniture", title: "Conference Table Large", price: 26000, rating: 4.9, reviews: 23, location: "Upper Hill", image: 0 },
  { id: 59, category: "Furniture", title: "Bed Frame King Size", price: 14300, rating: 4.7, reviews: 25, location: "Kilimani", image: 0 },
  { id: 60, category: "Furniture", title: "Shelving Unit Industrial", price: 9100, rating: 4.6, reviews: 16, location: "Gigiri", image: 0 },
];
=======
  // Extract unique locations from listings
  const locations = ['all', ...Array.from(new Set(listings.map(l => l.location)))];

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || listing.category === selectedCategory;
    const matchesLocation = selectedLocation === 'all' || listing.location === selectedLocation;
    const matchesPrice = listing.price >= priceRange[0] && listing.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesLocation && matchesPrice;
  });
>>>>>>> b95c47ee75927bbf54af7c3daf388c6962ce273a

// Get all unique categories in order
const CATEGORIES = ["Electronics", "Tools", "Sports", "Outdoor", "Events", "Furniture"];

<<<<<<< HEAD
function IconSearch(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" {...props}>
      <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="11" cy="11" r="5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IconHeart(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path d="M12 21s-7-4.35-9-7 2-6 5-6 4 4 4 4 1-4 4-4 6 3 5 6-9 7-9 7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ListingCard({ listing }) {
  return (
    <article
      className="snap-start min-w-[320px] max-w-[360px] bg-white rounded-xl border border-gray-200 overflow-hidden flex-shrink-0 shadow-sm hover:shadow-md transition-shadow"
      aria-label={listing.title}
    >
      {/* Image Section */}
      <div className="w-full h-56 rounded-t-xl bg-gray-100 flex items-center justify-center overflow-hidden relative">
        {/* Placeholder SVG variations */}
        {listing.image === 0 && (
          <svg viewBox="0 0 200 140" className="w-40 h-40" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="cam1" x1="0" x2="1">
                <stop offset="0" stopColor="#1f2937" />
                <stop offset="1" stopColor="#374151" />
              </linearGradient>
            </defs>
            <rect x="50" y="30" width="100" height="80" rx="4" fill="url(#cam1)" />
            <circle cx="100" cy="70" r="25" fill="#4b5563" />
            <circle cx="100" cy="70" r="18" fill="#60748a" opacity="0.6" />
          </svg>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="inline-flex items-center gap-2 bg-amber-50 px-3 py-1 rounded-full text-xs font-medium text-amber-700 border border-amber-200">
          {listing.category}
        </div>

        <div className="mt-3">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
            {listing.title}
          </h3>
        </div>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3 h-3 ${i < Math.floor(listing.rating) ? 'fill-amber-400' : 'fill-gray-300'}`}
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-600">({listing.reviews})</span>
        </div>

        {/* Location */}
        <div className="mt-2 text-xs text-gray-600 flex items-center gap-1">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          </svg>
          {listing.location}
        </div>

        {/* Price and Action */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-gray-900">KSH {listing.price}</div>
            <div className="text-xs text-gray-500">per day</div>
          </div>
          <button
            aria-label="Add to favorites"
            className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-red-50 transition-colors"
          >
            <IconHeart className="text-gray-400" />
          </button>
        </div>
      </div>
    </article>
  );
}

function CategorySection({ category, listings }) {
  const scrollerRef = useRef(null);
  const scrollBy = (amt) => scrollerRef.current?.scrollBy({ left: amt, behavior: "smooth" });

  if (listings.length === 0) {
    return null;
  }

  return (
    <div className="mt-14">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-3xl md:text-4xl font-light text-gray-400">Browse</h3>
          <h2 className="text-4xl md:text-5xl mt-3 font-semibold text-gray-900">{category}</h2>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button onClick={() => scrollBy(-420)} className="h-10 w-10 rounded-full bg-amber-100 border border-amber-300 shadow-sm hover:bg-amber-200" aria-label="previous">←</button>
          <button onClick={() => scrollBy(420)} className="h-10 w-10 rounded-full bg-amber-100 border border-amber-300 shadow-sm hover:bg-amber-200" aria-label="next">→</button>
        </div>
      </div>

      {listings.length > 0 ? (
        <div ref={scrollerRef} className="flex gap-6 overflow-x-auto pb-6 -mx-1 px-1 scrollbar-hide snap-x snap-mandatory">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No {category.toLowerCase()} found matching your filters.
        </div>
      )}
    </div>
=======
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
      <div className="flex min-h-screen w-full bg-white">
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
              className="w-full border-black text-black hover:bg-black hover:text-white"
            >
              <UserCircle size={18} className="mr-2" />
              Profile
            </Button>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <SidebarInset className="flex-1">
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
                    className="pl-8 border-black h-12 bg-white"
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
          <div className="container mx-auto px-4 py-8 bg-[#FFB700]">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredListings.map((listing) => (
                <Card
                  key={listing.id}
                  className="bg-white shadow-none hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <CardContent className="p-0">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={listing.image}
                        alt={listing.title}
                        className="w-full h-full object-cover"
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
                            <span className="text-sm">★</span>
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

            {filteredListings.length === 0 && (
              <div className="text-center py-20">
                <h3 className="text-2xl font-bold mb-2">No items found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
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
                      src={selectedListing.image}
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
                        <span className="text-lg">★</span>
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
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End date</label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="border-black"
                    />
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
>>>>>>> b95c47ee75927bbf54af7c3daf388c6962ce273a
  );
}

export default function ListingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 100000]);

  // Filter listings based on search and filter criteria
  const filteredListings = useMemo(() => {
    return SAMPLE_LISTINGS.filter((listing) => {
      const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || listing.category === selectedCategory;
      const matchesLocation = !selectedLocation || listing.location === selectedLocation;
      const matchesPrice = listing.price >= priceRange[0] && listing.price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesLocation && matchesPrice;
    });
  }, [searchQuery, selectedCategory, selectedLocation, priceRange]);

  // Get unique locations from listings
  const locations = Array.from(new Set(SAMPLE_LISTINGS.map(l => l.location))).sort();

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedLocation(null);
    setPriceRange([0, 100000]);
  };

  // Check if any filters are active
  const hasActiveFilters = searchQuery || selectedCategory || selectedLocation || priceRange[0] > 0 || priceRange[1] < 100;

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Navbar */}
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="h-16 flex items-center justify-between gap-6 px-6 md:px-8 lg:px-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-md bg-amber-400 text-gray-900 flex items-center justify-center font-bold text-lg">R</div>
            <div className="hidden md:block text-sm font-semibold">RentMe</div>
          </div>

          <div className="flex-1 max-w-2xl">
            <label className="relative block">
              <input
                type="search"
                placeholder="Search items to rent..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 rounded-full border border-gray-200 px-4 pl-12 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                aria-label="Search items"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <IconSearch />
              </span>
            </label>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/signin"
              className="h-10 px-4 py-2 rounded-md border border-gray-200 bg-white text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="h-10 px-4 py-2 rounded-md bg-amber-400 text-gray-900 text-sm font-medium hover:bg-amber-500 transition-colors"
            >
              Sign up
            </Link>
          </div>


        </div>
      </header>

      {/* Main layout */}
      <SidebarProvider>
        <AppSidebar
          locations={locations}
          priceRange={priceRange}
          selectedLocation={selectedLocation}
          onPriceChange={setPriceRange}
          onLocationChange={setSelectedLocation}
          onClearFilters={clearFilters}
        />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger />
          </header>
          {/* Main Content */}
          <div className="flex-1 overflow-auto px-4 md:px-8 lg:px-10 py-8 lg:py-12">
            <section>
              {/* Render each category section */}
              {CATEGORIES.map((category) => (
                <CategorySection
                  key={category}
                  category={category}
                  listings={filteredListings.filter(l => l.category === category)}
                />
              ))}

              {/* No results message */}
              {filteredListings.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-xl text-gray-500">No items found matching your filters.</p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-6 py-2 bg-amber-400 text-gray-900 rounded-md font-medium hover:bg-amber-500"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </section>
          </div>
        </SidebarInset>
      </SidebarProvider>

      {/* Scrollbar hiding styles */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
