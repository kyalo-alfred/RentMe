// app/listings/page.tsx
"use client";
import React, { useRef, useState, useMemo } from "react";
import Link from "next/link";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

/**
 * Rental Listings Page for RentMe
 * Displays available items for rent with filtering and browsing capabilities
 */

const SAMPLE_LISTINGS = [
  // Electronics
  { id: 1, category: "Electronics", title: "Professional DSLR Camera", price: 6500, rating: 4.8, reviews: 32, location: "Westlands", image: 0 },
  { id: 2, category: "Electronics", title: "4K Projector with Screen", price: 8450, rating: 4.7, reviews: 28, location: "Gigiri", image: 0 },
  { id: 3, category: "Electronics", title: "Drone with 4K Camera", price: 9750, rating: 4.9, reviews: 51, location: "Upper Hill", image: 0 },
  { id: 4, category: "Electronics", title: "Sony Mirrorless Camera", price: 9100, rating: 4.8, reviews: 45, location: "Kilimani", image: 0 },
  { id: 5, category: "Electronics", title: "Gaming Laptop", price: 7150, rating: 4.8, reviews: 38, location: "Gigiri", image: 0 },
  { id: 6, category: "Electronics", title: "DJ Equipment Set", price: 10400, rating: 4.9, reviews: 42, location: "South B", image: 0 },
  { id: 7, category: "Electronics", title: "VR Headset", price: 5200, rating: 4.7, reviews: 25, location: "Westlands", image: 0 },
  { id: 8, category: "Electronics", title: "Sound System PA", price: 11700, rating: 4.8, reviews: 35, location: "Syokimau", image: 0 },
  { id: 9, category: "Electronics", title: "Electric Guitar & Amp", price: 7800, rating: 4.9, reviews: 28, location: "Ngara", image: 0 },
  { id: 10, category: "Electronics", title: "GoPro Action Camera", price: 5850, rating: 4.9, reviews: 41, location: "Yaya Centre", image: 0 },

  // Tools
  { id: 11, category: "Tools", title: "Power Drill Set", price: 1950, rating: 5.0, reviews: 22, location: "Westlands", image: 0 },
  { id: 12, category: "Tools", title: "Lawn Mower", price: 2600, rating: 4.7, reviews: 19, location: "Kilimani", image: 0 },
  { id: 13, category: "Tools", title: "Generator 5KVA", price: 6500, rating: 4.6, reviews: 30, location: "Industrial Area", image: 0 },
  { id: 14, category: "Tools", title: "Ladder Extension 20ft", price: 1560, rating: 4.5, reviews: 14, location: "Embakasi", image: 0 },
  { id: 15, category: "Tools", title: "Pressure Washer", price: 2600, rating: 4.8, reviews: 26, location: "Thika Road", image: 0 },
  { id: 16, category: "Tools", title: "Carpet Cleaner Machine", price: 3250, rating: 4.5, reviews: 18, location: "South C", image: 0 },
  { id: 17, category: "Tools", title: "Sewing Machine Industrial", price: 2600, rating: 4.6, reviews: 16, location: "Eastleigh", image: 0 },
  { id: 18, category: "Tools", title: "Chainsaw", price: 3900, rating: 4.6, reviews: 20, location: "Ngong", image: 0 },
  { id: 19, category: "Tools", title: "Baby Stroller Premium", price: 1950, rating: 4.8, reviews: 24, location: "Ruaka", image: 0 },
  { id: 20, category: "Tools", title: "Wheelchair", price: 1300, rating: 5.0, reviews: 17, location: "Buruburu", image: 0 },

  // Sports
  { id: 21, category: "Sports", title: "Mountain Bike", price: 4550, rating: 4.6, reviews: 28, location: "Parklands", image: 0 },
  { id: 22, category: "Sports", title: "Road Bike", price: 3900, rating: 4.9, reviews: 33, location: "Muthaiga", image: 0 },
  { id: 23, category: "Sports", title: "Electric Scooter", price: 2600, rating: 4.8, reviews: 29, location: "Kileleshwa", image: 0 },
  { id: 24, category: "Sports", title: "Stand Up Paddleboard", price: 4550, rating: 4.6, reviews: 21, location: "Rosslyn", image: 0 },
  { id: 25, category: "Sports", title: "Treadmill", price: 3250, rating: 4.7, reviews: 27, location: "Kikuyu", image: 0 },
  { id: 26, category: "Sports", title: "Kayak Single", price: 3250, rating: 4.7, reviews: 23, location: "Runda", image: 0 },
  { id: 27, category: "Sports", title: "Fishing Rod & Tackle Set", price: 2340, rating: 4.4, reviews: 15, location: "Limuru", image: 0 },
  { id: 28, category: "Sports", title: "Tennis Racket Set", price: 1950, rating: 4.6, reviews: 19, location: "Kilimani", image: 0 },
  { id: 29, category: "Sports", title: "Skateboard Pro", price: 1560, rating: 4.5, reviews: 11, location: "CBD", image: 0 },
  { id: 30, category: "Sports", title: "Rock Climbing Gear", price: 5200, rating: 4.8, reviews: 25, location: "Karen", image: 0 },

  // Outdoor
  { id: 31, category: "Outdoor", title: "Camping Tent 4 Person", price: 3900, rating: 4.5, reviews: 24, location: "Karen", image: 0 },
  { id: 32, category: "Outdoor", title: "Camping Stove & Cookware", price: 1950, rating: 4.6, reviews: 20, location: "Langata", image: 0 },
  { id: 33, category: "Outdoor", title: "Telescope", price: 4550, rating: 4.7, reviews: 18, location: "Ridgeways", image: 0 },
  { id: 34, category: "Outdoor", title: "Barbecue Grill Large", price: 3250, rating: 4.5, reviews: 16, location: "Rongai", image: 0 },
  { id: 35, category: "Outdoor", title: "Hiking Backpack Pro", price: 2600, rating: 4.7, reviews: 22, location: "Gigiri", image: 0 },
  { id: 36, category: "Outdoor", title: "Sleeping Bag Winter", price: 1560, rating: 4.6, reviews: 14, location: "Westlands", image: 0 },
  { id: 37, category: "Outdoor", title: "Portable Cooler", price: 2340, rating: 4.4, reviews: 13, location: "Karen", image: 0 },
  { id: 38, category: "Outdoor", title: "Binoculars Professional", price: 3640, rating: 4.8, reviews: 19, location: "Upper Hill", image: 0 },
  { id: 39, category: "Outdoor", title: "Camping Lantern LED", price: 1300, rating: 4.5, reviews: 17, location: "Parklands", image: 0 },
  { id: 40, category: "Outdoor", title: "Hammock with Stand", price: 2860, rating: 4.7, reviews: 26, location: "Spring Valley", image: 0 },

  // Events
  { id: 41, category: "Events", title: "Party Tent & Chairs", price: 13000, rating: 5.0, reviews: 35, location: "Lavington", image: 0 },
  { id: 42, category: "Events", title: "Wedding Dress", price: 9100, rating: 5.0, reviews: 28, location: "Ngong Road", image: 0 },
  { id: 43, category: "Events", title: "Folding Tables 5pc", price: 3900, rating: 4.4, reviews: 12, location: "Donholm", image: 0 },
  { id: 44, category: "Events", title: "Inflatable Bounce House", price: 19500, rating: 4.9, reviews: 31, location: "Kitisuru", image: 0 },
  { id: 45, category: "Events", title: "Party Lights LED", price: 5850, rating: 4.7, reviews: 21, location: "Kilimani", image: 0 },
  { id: 46, category: "Events", title: "Photo Booth Kit", price: 10400, rating: 5.0, reviews: 29, location: "Kasarani", image: 0 },
  { id: 47, category: "Events", title: "Fog Machine", price: 6500, rating: 4.8, reviews: 24, location: "Parklands", image: 0 },
  { id: 48, category: "Events", title: "Wedding Arch & Backdrop", price: 15600, rating: 4.9, reviews: 26, location: "Runda", image: 0 },
  { id: 49, category: "Events", title: "Catering Equipment Set", price: 26000, rating: 4.7, reviews: 19, location: "CBD", image: 0 },
  { id: 50, category: "Events", title: "Flower Decoration Kit", price: 5200, rating: 4.6, reviews: 15, location: "Karen", image: 0 },

  // Furniture
  { id: 51, category: "Furniture", title: "Modern Standing Desk", price: 10400, rating: 4.6, reviews: 18, location: "Karen", image: 0 },
  { id: 52, category: "Furniture", title: "Ergonomic Office Chair", price: 5200, rating: 4.5, reviews: 15, location: "Parklands", image: 0 },
  { id: 53, category: "Furniture", title: "Gaming Desk Setup", price: 12350, rating: 4.7, reviews: 22, location: "Spring Valley", image: 0 },
  { id: 54, category: "Furniture", title: "Adjustable Bookshelf Unit", price: 6500, rating: 4.4, reviews: 12, location: "Runda", image: 0 },
  { id: 55, category: "Furniture", title: "Office Sofa Leather", price: 15600, rating: 4.8, reviews: 26, location: "Westlands", image: 0 },
  { id: 56, category: "Furniture", title: "Dining Table Set 6pc", price: 19500, rating: 4.6, reviews: 20, location: "Karen", image: 0 },
  { id: 57, category: "Furniture", title: "Office Cabinet Wooden", price: 7800, rating: 4.5, reviews: 14, location: "CBD", image: 0 },
  { id: 58, category: "Furniture", title: "Conference Table Large", price: 26000, rating: 4.9, reviews: 23, location: "Upper Hill", image: 0 },
  { id: 59, category: "Furniture", title: "Bed Frame King Size", price: 14300, rating: 4.7, reviews: 25, location: "Kilimani", image: 0 },
  { id: 60, category: "Furniture", title: "Shelving Unit Industrial", price: 9100, rating: 4.6, reviews: 16, location: "Gigiri", image: 0 },
];

// Get all unique categories in order
const CATEGORIES = ["Electronics", "Tools", "Sports", "Outdoor", "Events", "Furniture"];

function IconSearch(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" {...props}>
      <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="11" cy="11" r="5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IconHeart(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path d="M12 21s-7-4.35-9-7 2-6 5-6 4 4 4 4 1-4 4-4 6 3 5 6-9 7-9 7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ListingCard({ listing }) {
  return (
    <article
      className="snap-start min-w-[320px] max-w-[360px] bg-white rounded-xl border border-gray-200 overflow-hidden flex-shrink-0 shadow-sm hover:shadow-md transition-shadow"
      aria-label={listing.title}
    >
      {/* Image Section */}
      <div className="w-full h-56 rounded-t-xl bg-gray-100 flex items-center justify-center overflow-hidden relative">
        {/* Placeholder SVG variations */}
        {listing.image === 0 && (
          <svg viewBox="0 0 200 140" className="w-40 h-40" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="cam1" x1="0" x2="1">
                <stop offset="0" stopColor="#1f2937" />
                <stop offset="1" stopColor="#374151" />
              </linearGradient>
            </defs>
            <rect x="50" y="30" width="100" height="80" rx="4" fill="url(#cam1)" />
            <circle cx="100" cy="70" r="25" fill="#4b5563" />
            <circle cx="100" cy="70" r="18" fill="#60748a" opacity="0.6" />
          </svg>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="inline-flex items-center gap-2 bg-amber-50 px-3 py-1 rounded-full text-xs font-medium text-amber-700 border border-amber-200">
          {listing.category}
        </div>

        <div className="mt-3">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
            {listing.title}
          </h3>
        </div>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3 h-3 ${i < Math.floor(listing.rating) ? 'fill-amber-400' : 'fill-gray-300'}`}
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-600">({listing.reviews})</span>
        </div>

        {/* Location */}
        <div className="mt-2 text-xs text-gray-600 flex items-center gap-1">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          </svg>
          {listing.location}
        </div>

        {/* Price and Action */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-gray-900">KSH {listing.price}</div>
            <div className="text-xs text-gray-500">per day</div>
          </div>
          <button
            aria-label="Add to favorites"
            className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-red-50 transition-colors"
          >
            <IconHeart className="text-gray-400" />
          </button>
        </div>
      </div>
    </article>
  );
}

function CategorySection({ category, listings }) {
  const scrollerRef = useRef(null);
  const scrollBy = (amt) => scrollerRef.current?.scrollBy({ left: amt, behavior: "smooth" });

  if (listings.length === 0) {
    return null;
  }

  return (
    <div className="mt-14">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-3xl md:text-4xl font-light text-gray-400">Browse</h3>
          <h2 className="text-4xl md:text-5xl mt-3 font-semibold text-gray-900">{category}</h2>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button onClick={() => scrollBy(-420)} className="h-10 w-10 rounded-full bg-amber-100 border border-amber-300 shadow-sm hover:bg-amber-200" aria-label="previous">←</button>
          <button onClick={() => scrollBy(420)} className="h-10 w-10 rounded-full bg-amber-100 border border-amber-300 shadow-sm hover:bg-amber-200" aria-label="next">→</button>
        </div>
      </div>

      {listings.length > 0 ? (
        <div ref={scrollerRef} className="flex gap-6 overflow-x-auto pb-6 -mx-1 px-1 scrollbar-hide snap-x snap-mandatory">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No {category.toLowerCase()} found matching your filters.
        </div>
      )}
    </div>
  );
}

export default function ListingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 100000]);

  // Filter listings based on search and filter criteria
  const filteredListings = useMemo(() => {
    return SAMPLE_LISTINGS.filter((listing) => {
      const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || listing.category === selectedCategory;
      const matchesLocation = !selectedLocation || listing.location === selectedLocation;
      const matchesPrice = listing.price >= priceRange[0] && listing.price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesLocation && matchesPrice;
    });
  }, [searchQuery, selectedCategory, selectedLocation, priceRange]);

  // Get unique locations from listings
  const locations = Array.from(new Set(SAMPLE_LISTINGS.map(l => l.location))).sort();

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedLocation(null);
    setPriceRange([0, 100000]);
  };

  // Check if any filters are active
  const hasActiveFilters = searchQuery || selectedCategory || selectedLocation || priceRange[0] > 0 || priceRange[1] < 100;

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Navbar */}
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="h-16 flex items-center justify-between gap-6 px-6 md:px-8 lg:px-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-md bg-amber-400 text-gray-900 flex items-center justify-center font-bold text-lg">R</div>
            <div className="hidden md:block text-sm font-semibold">RentMe</div>
          </div>

          <div className="flex-1 max-w-2xl">
            <label className="relative block">
              <input
                type="search"
                placeholder="Search items to rent..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 rounded-full border border-gray-200 px-4 pl-12 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                aria-label="Search items"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <IconSearch />
              </span>
            </label>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/signin"
              className="h-10 px-4 py-2 rounded-md border border-gray-200 bg-white text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="h-10 px-4 py-2 rounded-md bg-amber-400 text-gray-900 text-sm font-medium hover:bg-amber-500 transition-colors"
            >
              Sign up
            </Link>
          </div>


        </div>
      </header>

      {/* Main layout */}
      <SidebarProvider>
        <AppSidebar
          locations={locations}
          priceRange={priceRange}
          selectedLocation={selectedLocation}
          onPriceChange={setPriceRange}
          onLocationChange={setSelectedLocation}
          onClearFilters={clearFilters}
        />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger />
          </header>
          {/* Main Content */}
          <div className="flex-1 overflow-auto px-4 md:px-8 lg:px-10 py-8 lg:py-12">
            <section>
              {/* Render each category section */}
              {CATEGORIES.map((category) => (
                <CategorySection
                  key={category}
                  category={category}
                  listings={filteredListings.filter(l => l.category === category)}
                />
              ))}

              {/* No results message */}
              {filteredListings.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-xl text-gray-500">No items found matching your filters.</p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-6 py-2 bg-amber-400 text-gray-900 rounded-md font-medium hover:bg-amber-500"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </section>
          </div>
        </SidebarInset>
      </SidebarProvider>

      {/* Scrollbar hiding styles */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
