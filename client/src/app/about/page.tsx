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
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <header className="border-b border-black">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">RentMe</h1>

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
              <Button asChild variant="outline" className="border-black text-black hover:bg-black hover:text-white">
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button asChild className="bg-black text-white hover:bg-gray-800">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">About RentMe</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            RentMe is a web-based platform that revolutionizes how people share and access items.
            We connect those who need items temporarily with those who have them available to rent.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div>
            <h3 className="text-3xl font-bold mb-6">Our Mission</h3>
            <p className="text-lg text-gray-600 mb-6">
              To create a sustainable sharing economy where underutilized items can generate income
              for owners while providing affordable access to goods for renters. We believe in
              reducing waste and promoting community through temporary access to tools, equipment,
              and more.
            </p>
            <p className="text-lg text-gray-600">
              Whether you're a homeowner with power tools gathering dust, a photographer with
              extra camera gear, or someone who occasionally needs specialized equipment,
              RentMe makes it easy to share and access what you need.
            </p>
          </div>
          <div>
            <h3 className="text-3xl font-bold mb-6">How It Works</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <h4 className="font-bold">List Your Items</h4>
                  <p className="text-gray-600">Owners create listings with photos, descriptions, and pricing.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <h4 className="font-bold">Browse & Book</h4>
                  <p className="text-gray-600">Renters search, filter, and book items for specific dates.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <h4 className="font-bold">Secure Transactions</h4>
                  <p className="text-gray-600">Payments are processed securely through our demo system.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">4</div>
                <div>
                  <h4 className="font-bold">Delivery & Returns</h4>
                  <p className="text-gray-600">Choose from mock courier options for pickup and return.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="py-20 text-center">
          <h3 className="text-3xl font-bold mb-6">Join Our Community</h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Ready to start renting or sharing? Join thousands of users who are already part of the sharing economy.
          </p>
          <div className="space-x-4">
            <Button asChild size="lg" className="bg-black text-white hover:bg-gray-800">
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-black text-black hover:bg-black hover:text-white">
              <Link href="/listings">Browse Items</Link>
            </Button>
          </div>
        </section>
      </section>

<<<<<<< Updated upstream
      <footer className="border-t border-black py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
=======
      <footer className="bg-card-dark text-card-foreground border-t border-border py-12">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
          {/* Branding */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">RentMe</h2>
            <p className="text-muted-foreground">Rent what you need, share what you own.</p>
          </div>
          {/* Quick Links */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-primary">Quick Links</h3>
            <ul className="space-y-1">
              {['Home','About','Listings','Sign Up','Sign In'].map(link=>(
                <li key={link}>
                  <Link href={`/${link.toLowerCase().replace(' ', '')}`} className="hover:text-accent hover:underline transition-all">{link}</Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Contact / Social */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-primary">Contact</h3>
            <p className="text-muted-foreground">Email: support@rentme.com</p>
            <p className="text-muted-foreground">Phone: +254 700 000 000</p>
            <div className="flex gap-4 mt-2">
              {['Twitter','Facebook','Instagram'].map(social=>(
                <a key={social} href="#" className="hover:text-accent hover:underline transition-all">{social}</a>
              ))}
              </div>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-6 text-center text-muted-foreground text-sm">
>>>>>>> Stashed changes
          <p>&copy; 2025 RentMe. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
