'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    // Handle sign in logic here - connect to your Django backend
    console.log('Sign in:', { email, password });
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
            <CardTitle className="text-3xl font-bold">Sign In</CardTitle>
            <CardDescription className="text-gray-600">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-black font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-black focus:ring-black"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-black font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-black focus:ring-black"
                />
              </div>
              <Button
                onClick={handleSubmit}
                className="w-full bg-black text-white hover:bg-gray-800"
              >
                Sign In
              </Button>
            </div>

            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <a href="/signup" className="font-bold text-black underline hover:no-underline">
                  Sign Up
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
