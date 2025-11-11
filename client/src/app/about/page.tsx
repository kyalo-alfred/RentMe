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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, Database, Globe, Users } from 'lucide-react';

export default function About() {
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

      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 text-white">About RentMe</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            RentMe is a web-based platform that revolutionizes how people share and access items.
            We connect those who need items temporarily with those who have them available to rent.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div>
            <h3 className="text-3xl font-bold mb-6 text-[#ffaa1d]">Our Mission</h3>
            <p className="text-lg text-gray-400 mb-6">
              To create a sustainable sharing economy where underutilized items can generate income
              for owners while providing affordable access to goods for renters. We believe in
              reducing waste and promoting community through temporary access to tools, equipment,
              and more.
            </p>
            <p className="text-lg text-gray-400">
              Whether you're a homeowner with power tools gathering dust, a photographer with
              extra camera gear, or someone who occasionally needs specialized equipment,
              RentMe makes it easy to share and access what you need.
            </p>
          </div>
          <div>
            <h3 className="text-3xl font-bold mb-6 text-[#ffaa1d]">How It Works</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#ffaa1d] text-black rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <h4 className="font-bold text-white">List Your Items</h4>
                  <p className="text-gray-400">Owners create listings with photos, descriptions, and pricing.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#ffaa1d] text-black rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <h4 className="font-bold text-white">Browse & Book</h4>
                  <p className="text-gray-400">Renters search, filter, and book items for specific dates.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#ffaa1d] text-black rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <h4 className="font-bold text-white">Secure Transactions</h4>
                  <p className="text-gray-400">Payments are processed securely through our demo system.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#ffaa1d] text-black rounded-full flex items-center justify-center font-bold">4</div>
                <div>
                  <h4 className="font-bold text-white">Delivery & Returns</h4>
                  <p className="text-gray-400">Choose from mock courier options for pickup and return.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="py-20 text-center border-t border-[#ffaa1d]">
          <h3 className="text-3xl font-bold mb-6 text-[#ffaa1d]">Join Our Community</h3>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Ready to start renting or sharing? Join thousands of users who are already part of the sharing economy.
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
      </section>

      <footer className="border-t border-[#ffaa1d] py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2025 RentMe. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
