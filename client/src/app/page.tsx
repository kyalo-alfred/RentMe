// landing page for the project

'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Card, CardContent } from '@/components/ui/card';
import { Package, Clock, Shield, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-[#ffaa1d]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-[#ffaa1d]">RentMe</h1>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/">Home</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/about">About</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/listings">Listings</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex gap-2">
              <Button asChild variant="outline" className="border-[#ffaa1d] text-[#ffaa1d] hover:bg-[#ffaa1d] hover:text-black">
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button asChild className="bg-[#ffaa1d] text-black hover:bg-[#ff9500]">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6 text-white">Rent What You Need.<br />Share What You Own.</h2>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          A platform connecting people who need items temporarily with those who have them.
          From tools to cameras, rent anything you need or earn from what you own.
        </p>
        <div className="space-x-4">
          <Button asChild size="lg" className="bg-[#ffaa1d] text-black hover:bg-[#ff9500]">
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-[#ffaa1d] text-[#ffaa1d] hover:bg-[#ffaa1d] hover:text-black">
            <Link href="/listings">Browse Items</Link>
          </Button>
        </div>
      </section>
      <section className="bg-black text-white py-20 border-t border-[#ffaa1d]">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-[#ffaa1d]">How It Works</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-black border-2 border-[#ffaa1d]">
              <CardContent className="pt-6">
                <Package className="w-12 h-12 mb-4 text-[#ffaa1d]" />
                <h4 className="text-xl font-bold mb-2 text-white">List Items</h4>
                <p className="text-gray-400">Post items you own and set your rental terms and pricing.</p>
              </CardContent>
            </Card>

            <Card className="bg-black border-2 border-[#ffaa1d]">
              <CardContent className="pt-6">
                <Clock className="w-12 h-12 mb-4 text-[#ffaa1d]" />
                <h4 className="text-xl font-bold mb-2 text-white">Book Rentals</h4>
                <p className="text-gray-400">Find what you need and book it for the duration you require.</p>
              </CardContent>
            </Card>

            <Card className="bg-black border-2 border-[#ffaa1d]">
              <CardContent className="pt-6">
                <Shield className="w-12 h-12 mb-4 text-[#ffaa1d]" />
                <h4 className="text-xl font-bold mb-2 text-white">Secure Payments</h4>
                <p className="text-gray-400">Make safe demo payments through our integrated system.</p>
              </CardContent>
            </Card>

            <Card className="bg-black border-2 border-[#ffaa1d]">
              <CardContent className="pt-6">
                <TrendingUp className="w-12 h-12 mb-4 text-[#ffaa1d]" />
                <h4 className="text-xl font-bold mb-2 text-white">Choose Delivery</h4>
                <p className="text-gray-400">Select from mock courier options for convenient pickup and return.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="bg-black text-white py-20 border-t border-[#ffaa1d]">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold mb-6 text-[#ffaa1d]">Ready to Start Renting?</h3>
          <p className="text-xl mb-8 text-gray-400">Join our community today and unlock access to thousands of items.</p>
          <Button asChild size="lg" className="bg-[#ffaa1d] text-black hover:bg-[#ff9500]">
            <Link href="/signup">Create Your Account</Link>
          </Button>
        </div>
      </section>
      <footer className="border-t border-[#ffaa1d] py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2025 RentMe. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
