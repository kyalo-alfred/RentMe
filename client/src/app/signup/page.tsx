'use client';


import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SignUpPage() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password2: formData.confirmPassword,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phoneNumber,
      });
    } catch (err: any) {
      let errorMessage = 'Registration failed. Please try again.';

      try {
        const errorObj = JSON.parse(err.message);
        if (errorObj.username) {
          errorMessage = `Username: ${errorObj.username[0]}`;
        } else if (errorObj.email) {
          errorMessage = `Email: ${errorObj.email[0]}`;
        } else if (errorObj.password) {
          errorMessage = `Password: ${errorObj.password[0]}`;
        } else {
          errorMessage = Object.values(errorObj)[0] as string;
        }
      } catch {
        errorMessage = err.message || errorMessage;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="border-b border-[#ffaa1d]">
        <div className="container mx-auto px-4 py-4">
          <a href="/" className="text-2xl font-bold text-[#ffaa1d]">RentMe</a>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-2 border-[#ffaa1d] shadow-none bg-black">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold text-white">Create Account</CardTitle>
            <CardDescription className="text-gray-400">
              Join RentMe and start renting today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-900/20 border border-red-500 rounded text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white font-medium">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className="border-[#ffaa1d] bg-gray-900 text-white placeholder:text-gray-500 focus:ring-[#ffaa1d]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white font-medium">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className="border-[#ffaa1d] bg-gray-900 text-white placeholder:text-gray-500 focus:ring-[#ffaa1d]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-white font-medium">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  className="border-[#ffaa1d] bg-gray-900 text-white placeholder:text-gray-500 focus:ring-[#ffaa1d]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-white font-medium">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="border-[#ffaa1d] bg-gray-900 text-white placeholder:text-gray-500 focus:ring-[#ffaa1d]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-white font-medium">Phone Number (Optional)</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+1234567890"
                  value={formData.phoneNumber}
                  onChange={(e) => handleChange('phoneNumber', e.target.value)}
                  className="border-[#ffaa1d] bg-gray-900 text-white placeholder:text-gray-500 focus:ring-[#ffaa1d]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-white font-medium">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="border-[#ffaa1d] bg-gray-900 text-white placeholder:text-gray-500 focus:ring-[#ffaa1d]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white font-medium">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  className="border-[#ffaa1d] bg-gray-900 text-white placeholder:text-gray-500 focus:ring-[#ffaa1d]"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#ffaa1d] text-black hover:bg-[#ff9500] disabled:opacity-50 font-bold"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-gray-400">
                Already have an account?{' '}
                <a href="/signin" className="font-bold text-[#ffaa1d] underline hover:no-underline">
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
