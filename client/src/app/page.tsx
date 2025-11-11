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
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6">Rent What You Need.<br />Share What You Own.</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          A platform connecting people who need items temporarily with those who have them.
          From tools to cameras, rent anything you need or earn from what you own.
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
      <section className="bg-black text-white py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-white text-black border-none">
              <CardContent className="pt-6">
                <Package className="w-12 h-12 mb-4" />
                <h4 className="text-xl font-bold mb-2">List Items</h4>
                <p className="text-gray-600">Post items you own and set your rental terms and pricing.</p>
              </CardContent>
            </Card>

            <Card className="bg-white text-black border-none">
              <CardContent className="pt-6">
                <Clock className="w-12 h-12 mb-4" />
                <h4 className="text-xl font-bold mb-2">Book Rentals</h4>
                <p className="text-gray-600">Find what you need and book it for the duration you require.</p>
              </CardContent>
            </Card>

            <Card className="bg-white text-black border-none">
              <CardContent className="pt-6">
                <Shield className="w-12 h-12 mb-4" />
                <h4 className="text-xl font-bold mb-2">Secure Payments</h4>
                <p className="text-gray-600">Make safe demo payments through our integrated system.</p>
              </CardContent>
            </Card>

            <Card className="bg-white text-black border-none">
              <CardContent className="pt-6">
                <TrendingUp className="w-12 h-12 mb-4" />
                <h4 className="text-xl font-bold mb-2">Choose Delivery</h4>
                <p className="text-gray-600">Select from mock courier options for convenient pickup and return.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="bg-black text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold mb-6">Ready to Start Renting?</h3>
          <p className="text-xl mb-8 text-gray-300">Join our community today and unlock access to thousands of items.</p>
          <Button asChild size="lg" className="bg-white text-black hover:bg-gray-200">
            <Link href="/signup">Create Your Account</Link>
          </Button>
        </div>
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
