'use client';


import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = () => {
    // Handle sign up logic here - connect to your Django backend
    if (formData.password !== formData.confirmPassword) {
      console.error('Passwords do not match');
      return;
    }
    console.log('Sign up:', formData);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-black">
        <div className="container mx-auto px-4 py-4">
          <a href="/" className="text-2xl font-bold">RentMe</a>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-2 border-black shadow-none">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
            <CardDescription className="text-gray-600">
              Join RentMe and start renting today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-black font-medium">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className="border-black focus:ring-black"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-black font-medium">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className="border-black focus:ring-black"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-black font-medium">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="border-black focus:ring-black"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-black font-medium">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="border-black focus:ring-black"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-black font-medium">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  className="border-black focus:ring-black"
                />
              </div>
              <Button
                onClick={handleSubmit}
                className="w-full bg-black text-white hover:bg-gray-800"
              >
                Create Account
              </Button>
            </div>

            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">
                Already have an account?{' '}
                <a href="/signin" className="font-bold text-black underline hover:no-underline">
                  Sign In
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
