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

export default function About() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-[#ffaa1d]">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#ffaa1d]">RentMe</h1>

          <NavigationMenu>
            <NavigationMenuList>
              {["Home", "About", "Listings"].map((page) => (
                <NavigationMenuItem key={page}>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link href={`/${page === "Home" ? "" : page.toLowerCase()}`}>
                      {page}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex gap-2">
            <Button
              asChild
              variant="outline"
              className="border-[#ffaa1d] text-[#ffaa1d] hover:bg-[#ffaa1d] hover:text-black"
            >
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button
              asChild
              className="bg-[#ffaa1d] text-black hover:bg-[#ff9500]"
            >
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* About Section */}
      <main className="container mx-auto px-4 py-20">
        <section className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 text-white">About RentMe</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            RentMe connects people who need items temporarily with owners who want to share them.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          {/* Mission */}
          <div>
            <h3 className="text-3xl font-bold mb-6 text-[#ffaa1d]">Our Mission</h3>
            <p className="text-lg text-gray-400 mb-6">
              Enable a sustainable sharing economy where unused items generate income for owners while providing affordable access for renters.
            </p>
            <p className="text-lg text-gray-400">
              Whether you have power tools, camera gear, or specialized equipment, RentMe makes sharing simple and safe.
            </p>
          </div>

          {/* How It Works */}
          <div>
            <h3 className="text-3xl font-bold mb-6 text-[#ffaa1d]">How It Works</h3>
            <ol className="space-y-4 list-decimal list-inside">
              {[
                {
                  title: "List Your Items",
                  desc: "Owners create listings with photos, descriptions, and pricing.",
                },
                {
                  title: "Browse & Book",
                  desc: "Renters search, filter, and book items for specific dates.",
                },
                {
                  title: "Secure Transactions",
                  desc: "Payments are processed securely through our demo system.",
                },
                {
                  title: "Delivery & Returns",
                  desc: "Choose from mock courier options for pickup and return.",
                },
              ].map((step, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#ffaa1d] text-black rounded-full flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{step.title}</h4>
                    <p className="text-gray-400">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Call to Action */}
        <section className="py-20 text-center border-t border-[#ffaa1d]">
          <h3 className="text-3xl font-bold mb-6 text-[#ffaa1d]">Join Our Community</h3>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Start renting or sharing today with thousands of users in our community.
          </p>
          <div className="space-x-4">
            <Button
              asChild
              size="lg"
              className="bg-[#ffaa1d] text-black hover:bg-[#ff9500]"
            >
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-[#ffaa1d] text-[#ffaa1d] hover:bg-[#ffaa1d] hover:text-black"
            >
              <Link href="/listings">Browse Items</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#ffaa1d] py-8 text-center text-gray-400">
        <p>&copy; 2025 RentMe. All rights reserved.</p>
      </footer>
    </div>
  );
}
