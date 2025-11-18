"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Upload, DollarSign, Calendar, MapPin, Tag } from 'lucide-react';
import { listingsAPI } from '@/lib/api';

export default function PostItemPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    pricePeriod: 'day',
    location: '',
    condition: '',
    availableFrom: '',
    availableTo: ''
  });

  const [images, setImages] = useState<Array<{ file: File; preview: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categories = [
    'Electronics',
    'Tools',
    'Outdoor',
    'Sports',
    'Events',
    'Vehicles',
    'Home & Garden',
    'Photography',
    'Music',
    'Other'
  ];

  const conditions = [
    'Brand New',
    'Like New',
    'Good',
    'Fair',
    'Acceptable'
  ];

  const pricePeriods = [
    { value: 'hour', label: 'Per Hour' },
    { value: 'day', label: 'Per Day' },
    { value: 'week', label: 'Per Week' },
    { value: 'month', label: 'Per Month' }
  ];

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map((file: File) => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages([...images, ...newImages].slice(0, 5)); // Max 5 images
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    // Validate form
    if (!formData.title || !formData.description || !formData.category || !formData.price || !formData.location || !formData.condition) {
      setError('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    // Check if user is authenticated
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token) {
      setError('Please sign in to post an item');
      setIsSubmitting(false);
      return;
    }

    // Create FormData for file upload
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    submitData.append('category', formData.category);
    submitData.append('price', formData.price);
    submitData.append('price_period', formData.pricePeriod);
    submitData.append('location', formData.location);
    submitData.append('condition', formData.condition);

    if (formData.availableFrom) {
      submitData.append('available_from', formData.availableFrom);
    }
    if (formData.availableTo) {
      submitData.append('available_to', formData.availableTo);
    }

    images.forEach((image) => {
      submitData.append('images', image.file);
    });

    try {
      const response = await listingsAPI.createListing(submitData);
      setSuccess('Item posted successfully!');

      // Redirect to listings page after 1 second
      setTimeout(() => {
        window.location.href = '/listings';
      }, 1000);
    } catch (err: any) {
      console.error('Error posting item:', err);
      setError(err.message || 'Failed to post item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-[#ffaa1d]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/listings" className="text-2xl font-bold text-[#ffaa1d]">RentMe</a>
            <Button
              variant="outline"
              className="border-[#ffaa1d] text-[#ffaa1d] hover:bg-[#ffaa1d] hover:text-black"
            >
              <a href="/listings">Back to Listings</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="border-2 border-[#ffaa1d] shadow-none bg-black">
          <CardHeader className="border-b border-[#ffaa1d]">
            <CardTitle className="text-3xl text-white">Post an Item</CardTitle>
            <CardDescription className="text-gray-400">
              Fill in the details below to list your item for rent
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="p-4 border-l-4 border-red-500 bg-red-50 text-red-700">
                  <p className="font-medium">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="p-4 border-l-4 border-green-500 bg-green-50 text-green-700">
                  <p className="font-medium">{success}</p>
                </div>
              )}

              {/* Images Upload */}
              <div className="space-y-3">
                <Label className="text-white font-medium text-lg">
                  Photos <span className="text-[#ffaa1d]">*</span>
                </Label>
                <p className="text-sm text-gray-400">Add up to 5 photos</p>

                <div className="grid grid-cols-5 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-square border-2 border-[#ffaa1d]">
                      <img
                        src={image.preview}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-[#ffaa1d] text-black rounded-full p-1 hover:bg-[#ff9500]"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}

                  {images.length < 5 && (
                    <label className="aspect-square border-2 border-dashed border-[#ffaa1d] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-900 transition-colors text-[#ffaa1d]">
                      <Upload size={24} className="mb-2" />
                      <span className="text-xs text-center px-2">Add Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label className="text-white font-medium text-lg">
                  Title <span className="text-[#ffaa1d]">*</span>
                </Label>
                <Input
                  placeholder="e.g., Professional DSLR Camera"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="border-[#ffaa1d] bg-gray-900 text-white placeholder:text-gray-500 text-base focus:ring-[#ffaa1d]"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-white font-medium text-lg">
                  Description <span className="text-[#ffaa1d]">*</span>
                </Label>
                <textarea
                  placeholder="Describe your item, its features, and any rental terms..."
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border-2 border-[#ffaa1d] bg-gray-900 text-white placeholder:text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffaa1d] text-base"
                />
              </div>

              {/* Category and Condition */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white font-medium text-lg">
                    Category <span className="text-[#ffaa1d]">*</span>
                  </Label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-[#ffaa1d] bg-gray-900 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffaa1d] text-base"
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white font-medium text-lg">
                    Condition <span className="text-[#ffaa1d]">*</span>
                  </Label>
                  <select
                    value={formData.condition}
                    onChange={(e) => handleChange('condition', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-[#ffaa1d] bg-gray-900 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffaa1d] text-base"
                  >
                    <option value="">Select condition</option>
                    {conditions.map(cond => (
                      <option key={cond} value={cond}>{cond}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-3">
                <Label className="text-white font-medium text-lg">
                  Price <span className="text-[#ffaa1d]">*</span>
                </Label>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#ffaa1d]" size={20} />
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) => handleChange('price', e.target.value)}
                        className="pl-10 border-[#ffaa1d] bg-gray-900 text-white placeholder:text-gray-500 text-base focus:ring-[#ffaa1d]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <select
                      value={formData.pricePeriod}
                      onChange={(e) => handleChange('pricePeriod', e.target.value)}
                      className="w-full px-3 py-2 border-2 border-[#ffaa1d] bg-gray-900 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffaa1d] text-base"
                    >
                      {pricePeriods.map(period => (
                        <option key={period.value} value={period.value}>
                          {period.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label className="text-white font-medium text-lg">
                  Location <span className="text-[#ffaa1d]">*</span>
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#ffaa1d]" size={20} />
                  <Input
                    placeholder="e.g., Westlands, Nairobi"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    className="pl-10 border-[#ffaa1d] bg-gray-900 text-white placeholder:text-gray-500 text-base focus:ring-[#ffaa1d]"
                  />
                </div>
              </div>

              {/* Availability Dates */}
              <div className="space-y-3">
                <Label className="text-white font-medium text-lg">
                  Availability
                </Label>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-400">Available From</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#ffaa1d]" size={20} />
                      <Input
                        type="date"
                        value={formData.availableFrom}
                        onChange={(e) => handleChange('availableFrom', e.target.value)}
                        className="pl-10 border-[#ffaa1d] bg-gray-900 text-white focus:ring-[#ffaa1d]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-400">Available To</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#ffaa1d]" size={20} />
                      <Input
                        type="date"
                        value={formData.availableTo}
                        onChange={(e) => handleChange('availableTo', e.target.value)}
                        className="pl-10 border-[#ffaa1d] bg-gray-900 text-white focus:ring-[#ffaa1d]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-[#ffaa1d]">
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-[#ffaa1d] text-black hover:bg-[#ff9500] text-lg py-6 font-bold"
                >
                  {isSubmitting ? 'Posting Item...' : 'Post Item'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
