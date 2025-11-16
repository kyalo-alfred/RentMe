"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Package, Settings, LogOut, Edit2, Trash2, Eye, Calendar, ShoppingBag } from 'lucide-react';
import { listingsAPI, bookingsAPI } from '@/lib/api';

export default function AccountPage() {
  const { user, logout, loading, refreshUser } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');

  // Form data for editing
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    date_of_birth: '',
  });

  // Password change form
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  // Initialize form data when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        date_of_birth: user.date_of_birth || '',
      });
    }
  }, [user]);

  // State for listings and bookings
  const [userListings, setUserListings] = useState<any[]>([]);
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [loadingListings, setLoadingListings] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Fetch user's listings
  useEffect(() => {
    if (user && activeTab === 'listings') {
      fetchUserListings();
    }
  }, [user, activeTab]);

  // Fetch user's bookings
  useEffect(() => {
    if (user && activeTab === 'bookings') {
      fetchMyBookings();
    }
  }, [user, activeTab]);

  const fetchUserListings = async () => {
    try {
      setLoadingListings(true);
      const data = await listingsAPI.getMyListings();
      setUserListings(data.results || data);
    } catch (err) {
      console.error('Error fetching listings:', err);
      setUserListings([]);
    } finally {
      setLoadingListings(false);
    }
  };

  const fetchMyBookings = async () => {
    try {
      setLoadingBookings(true);
      const data = await bookingsAPI.getMyBookings();
      setMyBookings(data.results || data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setMyBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleProfileUpdate = async () => {
    setUpdateError('');
    setUpdateSuccess('');
    setIsSaving(true);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const token = localStorage.getItem('access_token');

      const response = await fetch(`${API_BASE_URL}/auth/profile/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(JSON.stringify(error));
      }

      await refreshUser(); // Refresh user data in context
      setUpdateSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      let errorMessage = 'Failed to update profile';
      try {
        const errorObj = JSON.parse(err.message);
        errorMessage = Object.values(errorObj).flat().join(', ');
      } catch {
        errorMessage = err.message || errorMessage;
      }
      setUpdateError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.new_password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const token = localStorage.getItem('access_token');

      const response = await fetch(`${API_BASE_URL}/auth/password/change/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          old_password: passwordData.old_password,
          new_password: passwordData.new_password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.old_password?.[0] || error.new_password?.[0] || 'Failed to change password');
      }

      setPasswordSuccess('Password changed successfully!');
      setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password');
    }
  };

  const handleDeleteListing = async (id: number) => {
    if (!confirm('Are you sure you want to delete this listing?')) {
      return;
    }
    // Note: Delete functionality would need to be added to the API
    console.log('Delete listing:', id);
    alert('Delete functionality coming soon');
  };

  const handleLogout = async () => {
    await logout();
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold">Loading...</div>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return null;
  }

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
                    {user.first_name?.[0] || 'U'}{user.last_name?.[0] || 'U'}
                  </div>
                  <h3 className="text-center font-bold text-lg">
                    {user.first_name} {user.last_name}
                  </h3>
                  <div className="text-center text-sm text-gray-600 mt-1">
                    ★ {user.rating} • @{user.username}
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
                    onClick={() => setActiveTab('bookings')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${activeTab === 'bookings'
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-gray-100'
                      }`}
                  >
                    <ShoppingBag size={20} />
                    <span className="font-medium">My Bookings</span>
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
                  {updateError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                      {updateError}
                    </div>
                  )}
                  {updateSuccess && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-600 text-sm">
                      {updateSuccess}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-black font-medium">First Name</Label>
                        <Input
                          value={formData.first_name}
                          onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                          disabled={!isEditing}
                          className="border-black"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-black font-medium">Last Name</Label>
                        <Input
                          value={formData.last_name}
                          onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                          disabled={!isEditing}
                          className="border-black"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-black font-medium">Email</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!isEditing}
                        className="border-black"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-black font-medium">Phone Number</Label>
                      <Input
                        type="tel"
                        value={formData.phone_number}
                        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                        disabled={!isEditing}
                        className="border-black"
                        placeholder="+1234567890"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-black font-medium">Date of Birth</Label>
                      <Input
                        type="date"
                        value={formData.date_of_birth}
                        onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                        disabled={!isEditing}
                        className="border-black"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-black font-medium">Username</Label>
                      <Input
                        value={user.username}
                        disabled
                        className="border-black bg-gray-50"
                      />
                      <p className="text-xs text-gray-500">Username cannot be changed</p>
                    </div>

                    {isEditing && (
                      <Button
                        onClick={handleProfileUpdate}
                        disabled={isSaving}
                        className="w-full bg-black text-white hover:bg-gray-800 disabled:opacity-50"
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-black">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{user.rating}</div>
                      <div className="text-sm text-gray-600">Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{user.is_verified ? '✓' : '✗'}</div>
                      <div className="text-sm text-gray-600">Verified</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{userListings.length}</div>
                      <div className="text-sm text-gray-600">Listings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{myBookings.length}</div>
                      <div className="text-sm text-gray-600">Bookings</div>
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
                      <a href="/post-items">Add New Item</a>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {loadingListings ? (
                    <div className="text-center py-8">
                      <div className="text-gray-600">Loading listings...</div>
                    </div>
                  ) : userListings.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">You haven't posted any items yet.</p>
                      <Button className="bg-black text-white hover:bg-gray-800">
                        <a href="/post-items">Post Your First Item</a>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userListings.map((listing) => (
                        <div
                          key={listing.id}
                          className="flex gap-4 p-4 border-2 border-black rounded hover:bg-gray-50 transition-colors"
                        >
                          {listing.primary_image ? (
                            <img
                              src={listing.primary_image}
                              alt={listing.title}
                              className="w-24 h-24 object-cover border border-black"
                            />
                          ) : (
                            <div className="w-24 h-24 bg-gray-200 border border-black flex items-center justify-center">
                              <span className="text-gray-400 text-xs">No Image</span>
                            </div>
                          )}

                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-bold text-lg">{listing.title}</h3>
                                <p className="text-xl font-bold mt-1">
                                  {listing.price} {listing.price_period === 'day' ? 'KES' : ''}
                                  <span className="text-sm text-gray-600">/{listing.price_period}</span>
                                </p>
                              </div>
                              <div className={`px-3 py-1 border-2 text-sm font-bold ${listing.is_available
                                ? 'border-black bg-white'
                                : 'border-black bg-black text-white'
                                }`}>
                                {listing.is_available ? 'AVAILABLE' : 'UNAVAILABLE'}
                              </div>
                            </div>

                            <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Eye size={14} />
                                <span>{listing.views_count || 0} views</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Package size={14} />
                                <span>{listing.bookings?.length || 0} bookings</span>
                              </div>
                              {listing.average_rating && parseFloat(listing.average_rating) > 0 && (
                                <div className="flex items-center gap-1">
                                  <span>★</span>
                                  <span>{parseFloat(listing.average_rating).toFixed(1)}</span>
                                </div>
                              )}
                            </div>

                            <div className="flex gap-2 mt-3">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-black text-black hover:bg-black hover:text-white"
                                onClick={() => router.push(`/listings/${listing.id}`)}
                              >
                                <Eye size={14} className="mr-1" />
                                View
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <Card className="border-2 border-black shadow-none">
                <CardHeader className="border-b border-black">
                  <div>
                    <CardTitle className="text-2xl">My Bookings</CardTitle>
                    <CardDescription className="text-gray-600">
                      Items you've rented
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {loadingBookings ? (
                    <div className="text-center py-8">
                      <div className="text-gray-600">Loading bookings...</div>
                    </div>
                  ) : myBookings.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">You haven't booked any items yet.</p>
                      <Button className="bg-black text-white hover:bg-gray-800">
                        <a href="/listings">Browse Items</a>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {myBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="flex gap-4 p-4 border-2 border-black rounded hover:bg-gray-50 transition-colors"
                        >
                          {booking.listing_details?.primary_image ? (
                            <img
                              src={booking.listing_details.primary_image}
                              alt={booking.listing_details.title}
                              className="w-24 h-24 object-cover border border-black"
                            />
                          ) : (
                            <div className="w-24 h-24 bg-gray-200 border border-black flex items-center justify-center">
                              <span className="text-gray-400 text-xs">No Image</span>
                            </div>
                          )}

                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-bold text-lg">{booking.listing_details?.title || 'Item'}</h3>
                                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                                  <Calendar size={14} />
                                  <span>
                                    {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-xl font-bold mt-2">
                                  {booking.total_price} KES
                                </p>
                              </div>
                              <div className={`px-3 py-1 border-2 text-sm font-bold ${
                                booking.status === 'CONFIRMED' || booking.status === 'ACTIVE'
                                  ? 'border-green-600 bg-green-50 text-green-700'
                                  : booking.status === 'COMPLETED'
                                  ? 'border-gray-600 bg-gray-50 text-gray-700'
                                  : booking.status === 'CANCELLED'
                                  ? 'border-red-600 bg-red-50 text-red-700'
                                  : 'border-black bg-white'
                              }`}>
                                {booking.status}
                              </div>
                            </div>

                            {booking.listing_details?.owner && (
                              <div className="mt-3 text-sm text-gray-600">
                                Owner: <span className="font-medium text-black">
                                  {booking.listing_details.owner.first_name && booking.listing_details.owner.last_name
                                    ? `${booking.listing_details.owner.first_name} ${booking.listing_details.owner.last_name}`
                                    : booking.listing_details.owner.username}
                                </span>
                              </div>
                            )}

                            <div className="flex gap-2 mt-3">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-black text-black hover:bg-black hover:text-white"
                                onClick={() => router.push(`/listings/${booking.listing_details?.id || booking.listing}`)}
                              >
                                <Eye size={14} className="mr-1" />
                                View Item
                              </Button>
                              {booking.status === 'PENDING' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-600 text-red-600 hover:bg-red-50"
                                  onClick={async () => {
                                    if (confirm('Are you sure you want to cancel this booking?')) {
                                      try {
                                        await bookingsAPI.cancelBooking(booking.id);
                                        fetchMyBookings();
                                        alert('Booking cancelled successfully');
                                      } catch (err) {
                                        alert('Failed to cancel booking');
                                      }
                                    }
                                  }}
                                >
                                  Cancel
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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

                      {passwordError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                          {passwordError}
                        </div>
                      )}
                      {passwordSuccess && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded text-green-600 text-sm">
                          {passwordSuccess}
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label className="text-black font-medium">Current Password</Label>
                        <Input
                          type="password"
                          className="border-black"
                          value={passwordData.old_password}
                          onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-black font-medium">New Password</Label>
                        <Input
                          type="password"
                          className="border-black"
                          value={passwordData.new_password}
                          onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-black font-medium">Confirm New Password</Label>
                        <Input
                          type="password"
                          className="border-black"
                          value={passwordData.confirm_password}
                          onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                        />
                      </div>
                      <Button
                        className="bg-black text-white hover:bg-gray-800"
                        onClick={handlePasswordChange}
                      >
                        Update Password
                      </Button>
                    </div>

                    <div className="border-t border-black pt-6">
                      <h3 className="font-bold text-lg mb-4">Account Information</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium">{user.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Username:</span>
                          <span className="font-medium">@{user.username}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Verified:</span>
                          <span className="font-medium">{user.is_verified ? 'Yes ✓' : 'No'}</span>
                        </div>
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
