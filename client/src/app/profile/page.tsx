"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/Link'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CircleChevronLeft, User, Package, Settings, LogOut, Edit2, Trash2, Eye } from 'lucide-react';
import next from 'next';

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

  // User listings state
  const [userListings, setUserListings] = useState<any[]>([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [listingsError, setListingsError] = useState('');

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

  // Fetch user listings
  useEffect(() => {
    const fetchUserListings = async () => {
      if (!user) return;

      setListingsLoading(true);
      setListingsError('');

      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        const token = localStorage.getItem('access_token');

        const response = await fetch(`${API_BASE_URL}/listings/mine/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch listings');
        }

        const data = await response.json();
        setUserListings(data);
      } catch (err: any) {
        console.error('Error fetching user listings:', err);
        setListingsError(err.message || 'Failed to load listings');
      } finally {
        setListingsLoading(false);
      }
    };

    if (user) {
      fetchUserListings();
    }
  }, [user]);

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

  const handleDeleteListing = (id: number) => {
    // Handle listing deletion
    console.log('Deleting listing:', id);
  };

  const handleLogout = async () => {
    await logout();
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">Loading...</div>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FFB700]">
      {/* Header */}
      <header className="sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/listings">
                <CircleChevronLeft className="text-white w-6 h-6" /><p className='text-white font-bold'>Esc</p>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-2 border-[#ffaa1d] shadow-none bg-black">
              <CardContent className="p-0">
                {/* Profile Summary */}
                <div className="p-6 border-b border-[#ffaa1d]">
                  <div className="w-24 h-24 mx-auto bg-[#ffaa1d] text-gray-900 rounded-full flex items-center justify-center text-3xl font-bold mb-4">
                    {user.first_name?.[0] || 'U'}{user.last_name?.[0] || 'U'}
                  </div>
                  <h3 className="text-center font-bold text-lg text-white">
                    {user.first_name} {user.last_name}
                  </h3>
                  <div className="text-center text-sm text-gray-400 mt-1">
                    ★ {user.rating} • @{user.username}
                  </div>
                </div>

                {/* Navigation */}
                <nav className="p-4">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${activeTab === 'profile'
                      ? 'bg-[#ffaa1d] text-gray-900'
                      : 'text-[#ffaa1d] hover:bg-gray-800'
                      }`}
                  >
                    <User size={20} />
                    <span className="font-medium">Profile</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('listings')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${activeTab === 'listings'
                      ? 'bg-[#ffaa1d] text-gray-900'
                      : 'text-[#ffaa1d] hover:bg-gray-800'
                      }`}
                  >
                    <Package size={20} />
                    <span className="font-medium">My Listings</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${activeTab === 'settings'
                      ? 'bg-[#ffaa1d] text-gray-900'
                      : 'text-[#ffaa1d] hover:bg-gray-800'
                      }`}
                  >
                    <Settings size={20} />
                    <span className="font-medium">Settings</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded text-[#ffaa1d] hover:bg-gray-800 transition-colors"
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
              <Card className="border-2 border-[#ffaa1d] shadow-none bg-black">
                <CardHeader className="border-b border-[#ffaa1d]">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-white">Profile Information</CardTitle>
                      <CardDescription className="text-gray-400">
                        Manage your personal information
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => setIsEditing(!isEditing)}
                      variant="outline"
                      className="border-[#ffaa1d] text-[#ffaa1d] hover:bg-[#ffaa1d] hover:text-gray-900"
                    >
                      <Edit2 size={16} className="mr-2" />
                      {isEditing ? 'Cancel' : 'Edit'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {updateError && (
                    <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded text-red-200 text-sm">
                      {updateError}
                    </div>
                  )}
                  {updateSuccess && (
                    <div className="mb-4 p-3 bg-green-900 border border-green-700 rounded text-green-200 text-sm">
                      {updateSuccess}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white font-medium">First Name</Label>
                        <Input
                          value={formData.first_name}
                          onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                          disabled={!isEditing}
                          className="border-[#ffaa1d] bg-gray-800 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white font-medium">Last Name</Label>
                        <Input
                          value={formData.last_name}
                          onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                          disabled={!isEditing}
                          className="border-[#ffaa1d] bg-gray-800 text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white font-medium">Email</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!isEditing}
                        className="border-[#ffaa1d] bg-gray-800 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white font-medium">Phone Number</Label>
                      <Input
                        type="tel"
                        value={formData.phone_number}
                        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                        disabled={!isEditing}
                        className="border-[#ffaa1d] bg-gray-800 text-white"
                        placeholder="+1234567890"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white font-medium">Date of Birth</Label>
                      <Input
                        type="date"
                        value={formData.date_of_birth}
                        onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                        disabled={!isEditing}
                        className="border-[#ffaa1d] bg-gray-800 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white font-medium">Username</Label>
                      <Input
                        value={user.username}
                        disabled
                        className="border-[#ffaa1d] bg-gray-800 text-white"
                      />
                      <p className="text-xs text-gray-400">Username cannot be changed</p>
                    </div>

                    {isEditing && (
                      <Button
                        onClick={handleProfileUpdate}
                        disabled={isSaving}
                        className="w-full bg-[#ffaa1d] text-gray-900 hover:bg-[#ff9500] disabled:opacity-50 font-bold"
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#ffaa1d]">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#ffaa1d]">{user.rating}</div>
                      <div className="text-sm text-gray-400">Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#ffaa1d]">{user.is_verified ? '✓' : '✗'}</div>
                      <div className="text-sm text-gray-400">Verified</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#ffaa1d]">{userListings.length}</div>
                      <div className="text-sm text-gray-400">Listings</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Listings Tab */}
            {activeTab === 'listings' && (
              <Card className="border-2 border-[#ffaa1d] shadow-none bg-gray-900">
                <CardHeader className="border-b border-[#ffaa1d]">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-white">My Listings</CardTitle>
                      <CardDescription className="text-gray-400">
                        Manage your rental items
                      </CardDescription>
                    </div>
                    <Button className="bg-[#ffaa1d] text-gray-900 hover:bg-[#ff9500] font-bold">
                      <a href="/post-item">Add New Item</a>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {listingsLoading ? (
                    <div className="text-center py-8 text-white">Loading listings...</div>
                  ) : listingsError ? (
                    <div className="text-center py-8">
                      <p className="text-red-400 mb-4">{listingsError}</p>
                      <Button
                        onClick={() => window.location.reload()}
                        className="bg-[#ffaa1d] text-gray-900 hover:bg-[#ff9500] font-bold"
                      >
                        Retry
                      </Button>
                    </div>
                  ) : userListings.length === 0 ? (
                    <div className="text-center py-8">
                      <Package size={48} className="mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-400 mb-4">You haven't posted any items yet</p>
                      <Button className="bg-[#ffaa1d] text-gray-900 hover:bg-[#ff9500] font-bold">
                        <a href="/post-item">Post Your First Item</a>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userListings.map((listing) => (
                        <div
                          key={listing.id}
                          className="flex gap-4 p-4 border-2 border-[#ffaa1d] rounded hover:bg-gray-800 transition-colors"
                        >
                          {listing.image && (
                            <img
                              src={listing.image}
                              alt={listing.title}
                              className="w-24 h-24 object-cover border border-[#ffaa1d]"
                            />
                          )}

                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-bold text-lg text-white">{listing.title}</h3>
                                <p className="text-xl font-bold mt-1 text-[#ffaa1d]">
                                  ${listing.price}
                                  <span className="text-sm text-gray-400">/{listing.price_period}</span>
                                </p>
                                {listing.category && (
                                  <p className="text-sm text-gray-400 mt-1">{listing.category}</p>
                                )}
                              </div>
                              <div className={`px-3 py-1 border-2 text-sm font-bold ${listing.is_active
                                ? 'border-[#ffaa1d] bg-gray-900 text-[#ffaa1d]'
                                : 'border-gray-500 bg-gray-800 text-gray-400'
                                }`}>
                                {listing.is_active ? 'ACTIVE' : 'INACTIVE'}
                              </div>
                            </div>

                            {listing.description && (
                              <p className="text-sm text-gray-400 mt-2 line-clamp-2">{listing.description}</p>
                            )}

                            <div className="flex gap-2 mt-3">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-[#ffaa1d] text-[#ffaa1d] hover:bg-[#ffaa1d] hover:text-gray-900"
                              >
                                <Edit2 size={14} className="mr-1" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-[#ffaa1d] text-[#ffaa1d] hover:bg-[#ffaa1d] hover:text-gray-900"
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
                  )}
                </CardContent>
              </Card>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <Card className="border-2 border-[#ffaa1d] shadow-none bg-gray-900">
                <CardHeader className="border-b border-[#ffaa1d]">
                  <CardTitle className="text-2xl text-white">Account Settings</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your account preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-bold text-lg text-white">Change Password</h3>

                      {passwordError && (
                        <div className="p-3 bg-red-900 border border-red-700 rounded text-red-200 text-sm">
                          {passwordError}
                        </div>
                      )}
                      {passwordSuccess && (
                        <div className="p-3 bg-green-900 border border-green-700 rounded text-green-200 text-sm">
                          {passwordSuccess}
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label className="text-white font-medium">Current Password</Label>
                        <Input
                          type="password"
                          className="border-[#ffaa1d] bg-gray-800 text-white"
                          value={passwordData.old_password}
                          onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white font-medium">New Password</Label>
                        <Input
                          type="password"
                          className="border-[#ffaa1d] bg-gray-800 text-white"
                          value={passwordData.new_password}
                          onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white font-medium">Confirm New Password</Label>
                        <Input
                          type="password"
                          className="border-[#ffaa1d] bg-gray-800 text-white"
                          value={passwordData.confirm_password}
                          onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                        />
                      </div>
                      <Button
                        className="bg-[#ffaa1d] text-gray-900 hover:bg-[#ff9500] font-bold"
                        onClick={handlePasswordChange}
                      >
                        Update Password
                      </Button>
                    </div>

                    <div className="border-t border-[#ffaa1d] pt-6">
                      <h3 className="font-bold text-lg mb-4 text-white">Account Information</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Email:</span>
                          <span className="font-medium text-white">{user.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Username:</span>
                          <span className="font-medium text-white">@{user.username}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Verified:</span>
                          <span className="font-medium text-white">{user.is_verified ? 'Yes ✓' : 'No'}</span>
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
