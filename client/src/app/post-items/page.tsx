"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Upload, DollarSign, Calendar, MapPin, Tag } from 'lucide-react';

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

  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages([...images, ...newImages].slice(0, 5)); // Max 5 images
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Validate form
    if (!formData.title || !formData.description || !formData.category || !formData.price) {
      alert('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    // Create FormData for file upload
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });

    images.forEach((image, index) => {
      submitData.append(`image_${index}`, image.file);
    });

    // Submit to Django backend
    try {
      console.log('Submitting item:', formData);
      // Replace with actual API call:
      // const response = await fetch('http://localhost:8000/api/items/', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${yourAccessToken}`
      //   },
      //   body: submitData
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      alert('Item posted successfully!');
      // Redirect to listings page
      window.location.href = '/listings';
    } catch (error) {
      console.error('Error posting item:', error);
      alert('Failed to post item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-black">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="text-2xl font-bold">RentMe</a>
            <Button
              variant="outline"
              className="border-black text-black hover:bg-black hover:text-white"
            >
              <a href="/listings">Back to Listings</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="border-2 border-black shadow-none">
          <CardHeader className="border-b border-black">
            <CardTitle className="text-3xl">Post an Item</CardTitle>
            <CardDescription className="text-gray-600">
              Fill in the details below to list your item for rent
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Images Upload */}
              <div className="space-y-3">
                <Label className="text-black font-medium text-lg">
                  Photos <span className="text-red-600">*</span>
                </Label>
                <p className="text-sm text-gray-600">Add up to 5 photos</p>

                <div className="grid grid-cols-5 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-square border-2 border-black">
                      <img
                        src={image.preview}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-black text-white rounded-full p-1 hover:bg-gray-800"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}

                  {images.length < 5 && (
                    <label className="aspect-square border-2 border-dashed border-black flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
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
                <Label className="text-black font-medium text-lg">
                  Title <span className="text-red-600">*</span>
                </Label>
                <Input
                  placeholder="e.g., Professional DSLR Camera"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="border-black text-base"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-black font-medium text-lg">
                  Description <span className="text-red-600">*</span>
                </Label>
                <textarea
                  placeholder="Describe your item, its features, and any rental terms..."
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-black text-base"
                />
              </div>

              {/* Category and Condition */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-black font-medium text-lg">
                    Category <span className="text-red-600">*</span>
                  </Label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-black text-base"
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-black font-medium text-lg">
                    Condition <span className="text-red-600">*</span>
                  </Label>
                  <select
                    value={formData.condition}
                    onChange={(e) => handleChange('condition', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-black text-base"
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
                <Label className="text-black font-medium text-lg">
                  Price <span className="text-red-600">*</span>
                </Label>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) => handleChange('price', e.target.value)}
                        className="pl-10 border-black text-base"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <select
                      value={formData.pricePeriod}
                      onChange={(e) => handleChange('pricePeriod', e.target.value)}
                      className="w-full px-3 py-2 border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-black text-base"
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
                <Label className="text-black font-medium text-lg">
                  Location <span className="text-red-600">*</span>
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    placeholder="e.g., Westlands, Nairobi"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    className="pl-10 border-black text-base"
                  />
                </div>
              </div>

              {/* Availability Dates */}
              <div className="space-y-3">
                <Label className="text-black font-medium text-lg">
                  Availability
                </Label>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">Available From</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <Input
                        type="date"
                        value={formData.availableFrom}
                        onChange={(e) => handleChange('availableFrom', e.target.value)}
                        className="pl-10 border-black"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">Available To</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <Input
                        type="date"
                        value={formData.availableTo}
                        onChange={(e) => handleChange('availableTo', e.target.value)}
                        className="pl-10 border-black"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-black">
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-black text-white hover:bg-gray-800 text-lg py-6"
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
