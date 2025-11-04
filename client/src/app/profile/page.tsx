"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Package, Settings, LogOut, Edit2, Trash2, Eye } from 'lucide-react';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  // Mock user data - replace with actual data from backend
  const [userData, setUserData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+254 712 345 678',
    location: 'Nairobi, Kenya',
    bio: 'Love renting out my camera equipment and tools.',
    rating: 4.8,
    totalRentals: 45,
    joined: 'January 2024'
  });

  // Mock user listings - replace with API call
  const userListings = [
    {
      id: 1,
      title: 'Professional DSLR Camera',
      price: 50,
      period: 'day',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
      views: 124,
      bookings: 8
    },
    {
      id: 2,
      title: 'Power Drill Set',
      price: 15,
      period: 'day',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
      views: 89,
      bookings: 12
    },
    {
      id: 3,
      title: 'Camping Tent',
      price: 30,
      period: 'day',
      status: 'rented',
      image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400&h=300&fit=crop',
      views: 156,
      bookings: 15
    }
  ];

  const handleProfileUpdate = () => {
    // Handle profile update logic - connect to Django backend
    console.log('Updating profile:', userData);
    setIsEditing(false);
  };

  const handleDeleteListing = (id) => {
    // Handle listing deletion
    console.log('Deleting listing:', id);
  };

  const handleLogout = () => {
    // Handle logout logic
    console.log('Logging out...');
    window.location.href = '/signin';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-black">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="text-2xl font-bold">RentMe</a>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white">
                <a href="/listings">Browse Items</a>
              </Button>
              <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white">
                <a href="/post-item">Post Item</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-2 border-black shadow-none">
              <CardContent className="p-0">
                {/* Profile Summary */}
                <div className="p-6 border-b border-black">
                  <div className="w-24 h-24 mx-auto bg-black text-white rounded-full flex items-center justify-center text-3xl font-bold mb-4">
                    {userData.firstName[0]}{userData.lastName[0]}
                  </div>
                  <h3 className="text-center font-bold text-lg">
                    {userData.firstName} {userData.lastName}
                  </h3>
                  <div className="text-center text-sm text-gray-600 mt-1">
                    ★ {userData.rating} • {userData.totalRentals} rentals
                  </div>
                </div>

                {/* Navigation */}
                <nav className="p-2">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${activeTab === 'profile'
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-gray-100'
                      }`}
                  >
                    <User size={20} />
                    <span className="font-medium">Profile</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('listings')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${activeTab === 'listings'
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-gray-100'
                      }`}
                  >
                    <Package size={20} />
                    <span className="font-medium">My Listings</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${activeTab === 'settings'
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-gray-100'
                      }`}
                  >
                    <Settings size={20} />
                    <span className="font-medium">Settings</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded text-black hover:bg-gray-100 transition-colors"
                  >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <Card className="border-2 border-black shadow-none">
                <CardHeader className="border-b border-black">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">Profile Information</CardTitle>
                      <CardDescription className="text-gray-600">
                        Manage your personal information
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => setIsEditing(!isEditing)}
                      variant="outline"
                      className="border-black text-black hover:bg-black hover:text-white"
                    >
                      <Edit2 size={16} className="mr-2" />
                      {isEditing ? 'Cancel' : 'Edit'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-black font-medium">First Name</Label>
                        <Input
                          value={userData.firstName}
                          onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                          disabled={!isEditing}
                          className="border-black"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-black font-medium">Last Name</Label>
                        <Input
                          value={userData.lastName}
                          onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                          disabled={!isEditing}
                          className="border-black"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-black font-medium">Email</Label>
                      <Input
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        disabled={!isEditing}
                        className="border-black"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-black font-medium">Phone</Label>
                      <Input
                        value={userData.phone}
                        onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                        disabled={!isEditing}
                        className="border-black"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-black font-medium">Location</Label>
                      <Input
                        value={userData.location}
                        onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                        disabled={!isEditing}
                        className="border-black"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-black font-medium">Bio</Label>
                      <textarea
                        value={userData.bio}
                        onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                        disabled={!isEditing}
                        rows={4}
                        className="w-full px-3 py-2 border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-50"
                      />
                    </div>

                    {isEditing && (
                      <Button
                        onClick={handleProfileUpdate}
                        className="w-full bg-black text-white hover:bg-gray-800"
                      >
                        Save Changes
                      </Button>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-black">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{userData.totalRentals}</div>
                      <div className="text-sm text-gray-600">Total Rentals</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{userData.rating}</div>
                      <div className="text-sm text-gray-600">Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{userListings.length}</div>
                      <div className="text-sm text-gray-600">Active Listings</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Listings Tab */}
            {activeTab === 'listings' && (
              <Card className="border-2 border-black shadow-none">
                <CardHeader className="border-b border-black">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">My Listings</CardTitle>
                      <CardDescription className="text-gray-600">
                        Manage your rental items
                      </CardDescription>
                    </div>
                    <Button className="bg-black text-white hover:bg-gray-800">
                      <a href="/post-item">Add New Item</a>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {userListings.map((listing) => (
                      <div
                        key={listing.id}
                        className="flex gap-4 p-4 border-2 border-black rounded hover:bg-gray-50 transition-colors"
                      >
                        <img
                          src={listing.image}
                          alt={listing.title}
                          className="w-24 h-24 object-cover border border-black"
                        />

                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-bold text-lg">{listing.title}</h3>
                              <p className="text-xl font-bold mt-1">
                                ${listing.price}
                                <span className="text-sm text-gray-600">/{listing.period}</span>
                              </p>
                            </div>
                            <div className={`px-3 py-1 border-2 text-sm font-bold ${listing.status === 'active'
                              ? 'border-black bg-white'
                              : 'border-black bg-black text-white'
                              }`}>
                              {listing.status.toUpperCase()}
                            </div>
                          </div>

                          <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Eye size={14} />
                              <span>{listing.views} views</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Package size={14} />
                              <span>{listing.bookings} bookings</span>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-black text-black hover:bg-black hover:text-white"
                            >
                              <Edit2 size={14} className="mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-black text-black hover:bg-black hover:text-white"
                              onClick={() => handleDeleteListing(listing.id)}
                            >
                              <Trash2 size={14} className="mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <Card className="border-2 border-black shadow-none">
                <CardHeader className="border-b border-black">
                  <CardTitle className="text-2xl">Account Settings</CardTitle>
                  <CardDescription className="text-gray-600">
                    Manage your account preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-bold text-lg">Change Password</h3>
                      <div className="space-y-2">
                        <Label className="text-black font-medium">Current Password</Label>
                        <Input type="password" className="border-black" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-black font-medium">New Password</Label>
                        <Input type="password" className="border-black" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-black font-medium">Confirm New Password</Label>
                        <Input type="password" className="border-black" />
                      </div>
                      <Button className="bg-black text-white hover:bg-gray-800">
                        Update Password
                      </Button>
                    </div>

                    <div className="border-t border-black pt-6">
                      <h3 className="font-bold text-lg mb-4">Danger Zone</h3>
                      <div className="p-4 border-2 border-black">
                        <h4 className="font-bold mb-2">Delete Account</h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Once you delete your account, there is no going back. Please be certain.
                        </p>
                        <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white">
                          Delete My Account
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
