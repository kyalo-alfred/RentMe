"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { EmblaCarouselType } from "embla-carousel";

const cards = [
  {
    title: "List your items",
    subtitle: "Add items with title, description, category, daily price, and images.The entire setup process takes only a few minutes.",
    art: null,
  },
  {
    title: "Manage Listings",
    subtitle: "            Edit, update, or remove listings at any time. Availability updates automatically based on bookings.",
    art: null,
  },
  {
    title: "Browse and Search",
    subtitle: "            Explore items by category or search by keyword. Apply filters to find the exact item you need at the best price.",
    art: null,
  },

  {
    title: "Book and rent",
    subtitle: "            Select rental dates and book available items instantly. Status updates keep both parties aligned in real time.",
    art: null,
  },
];
const reviews = [
  {
    title: "AMAZING RENTAL EXPERIENCE",
    body: "I was able to rent the exact hiking gear I needed for my trip without spending hundreds. The process was seamless and the equipment was in perfect condition.",
    author: "SARAH M",
    rating: 5,
    verified: true,
  },
  {
    title: "MADE MONEY FROM ITEMS I WASN'T USING",
    body: "Had my camera sitting in a drawer for months. Listed it on RentMe and now I'm making $50/month just from renting it out on weekends. Best decision ever!",
    author: "JAMES T",
    rating: 5,
    verified: true,
  },
  {
    title: "PERFECT FOR TRYING BEFORE BUYING",
    body: "Rented a skateboard to see if I'd actually use it before committing to purchase. RentMe made it so easy and affordable. Highly recommend!",
    author: "ALEX P",
    rating: 5,
    verified: true,
  },
  {
    title: "SAVED ME THOUSANDS",
    body: "Instead of buying expensive party equipment, I rented everything from decorations to sound systems. RentMe made my event perfect and my wallet happy.",
    author: "MARIA G",
    rating: 5,
    verified: true,
  },
  {
    title: "GREAT COMMUNITY",
    body: "The RentMe community is so trustworthy and responsive. I've met wonderful people and built great connections through renting and lending items.",
    author: "DAVID K",
    rating: 5,
    verified: true,
  },
  {
    title: "SUSTAINABLE AND SMART",
    body: "Love that RentMe promotes sharing economy. I get what I need without adding clutter to my home, and it's better for the environment.",
    author: "EMMA W",
    rating: 5,
    verified: true,
  },
  {
    title: "QUICK AND RELIABLE",
    body: "Needed tools for a home project. RentMe had exactly what I needed, delivered quickly, and was a fraction of the cost of buying new.",
    author: "ROBERT H",
    rating: 5,
    verified: true,
  },
  {
    title: "BEST RENTAL PLATFORM OUT THERE",
    body: "After trying other platforms, RentMe is by far the easiest to use. Great selection, reliable people, and amazing customer service throughout.",
    author: "LISA B",
    rating: 5,
    verified: true,
  },
  {
    title: "EXCEEDED MY EXPECTATIONS",
    body: "Rented photography equipment for my wedding. The quality was outstanding and the rental process was incredibly smooth. Worth every penny!",
    author: "MICHAEL R",
    rating: 5,
    verified: true,
  },
  {
    title: "PERFECT SOLUTION FOR STUDENTS",
    body: "As a student, I couldn't afford to buy expensive equipment. RentMe let me rent what I needed at an affordable price. Game changer!",
    author: "JESSICA L",
    rating: 5,
    verified: true,
  },
  {
    title: "TRUST AND TRANSPARENCY",
    body: "Every interaction on RentMe has been transparent and trustworthy. I feel confident both renting and lending through this platform.",
    author: "THOMAS N",
    rating: 5,
    verified: true,
  },
  {
    title: "MONEY IN MY POCKET",
    body: "Started listing my sports equipment and now have a steady passive income stream. RentMe makes the whole process so simple!",
    author: "RACHEL V",
    rating: 5,
    verified: true,
  },
];


function Stars({ count = 5, size = 16 }) {
  const stars = Array.from({ length: 5 }).map((_, i) => (
    <svg
      key={i}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={i < count ? "#F59E0B" : "none"}
      stroke="#F59E0B"
      strokeWidth="1"
      className="inline-block"
      aria-hidden
    >
      <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.786 1.402 8.172L12 18.897 4.664 23.168l1.402-8.172L.132 9.21l8.2-1.192z" />
    </svg>
  ));
  return <span className="flex items-center gap-1">{stars}</span>;
}

const DotButton: React.FC<{
  selected: boolean;
  onClick: () => void;
}> = ({ selected, onClick }) => (
  <button
    type="button"
    className={`embla__dot w-3 h-3 rounded-full mx-1 transition-all duration-300 ${selected ? "bg-[#FFB700] w-6" : "bg-gray-500"
      }`}
    onClick={onClick}
    aria-label={selected ? "Selected slide" : "Go to slide"}
  />
);


export default function home() {
  const scroller = useRef(null);
  const [index, setIndex] = useState(0);
  const cardWidth = 360; // matches min-w-[360px] below including gap
  const rowRef = useRef(null);
  const [heroEmbla, heroEmblaApi] = useEmblaCarousel(
    { loop: true, align: "start", skipSnaps: false, draggable: true },
    []
  );

  const [heroPrevBtnDisabled, setHeroPrevBtnDisabled] = useState(true);
  const [heroNextBtnDisabled, setHeroNextBtnDisabled] = useState(true);

  const onHeroNavButtonClick = React.useCallback((emblaApi: EmblaCarouselType) => {
    const prevBtnDisabled = !emblaApi.canScrollPrev();
    const nextBtnDisabled = !emblaApi.canScrollNext();
    setHeroPrevBtnDisabled(prevBtnDisabled);
    setHeroNextBtnDisabled(nextBtnDisabled);
  }, []);

  const onHeroPrevButtonClick = React.useCallback(() => {
    if (!heroEmblaApi) return;
    heroEmblaApi.scrollPrev();
  }, [heroEmblaApi]);

  const onHeroNextButtonClick = React.useCallback(() => {
    if (!heroEmblaApi) return;
    heroEmblaApi.scrollNext();
  }, [heroEmblaApi]);

  React.useEffect(() => {
    if (!heroEmblaApi) return;

    const onSelect = () => onHeroNavButtonClick(heroEmblaApi);
    heroEmblaApi.on("select", onSelect);
    heroEmblaApi.on("reInit", onSelect);
    onHeroNavButtonClick(heroEmblaApi);
  }, [heroEmblaApi, onHeroNavButtonClick]);

  // For hero dots
  const [heroSelectedIndex, setHeroSelectedIndex] = useState(0);

  const onHeroSlideChange = React.useCallback((emblaApi: EmblaCarouselType) => {
    setHeroSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  React.useEffect(() => {
    if (!heroEmblaApi) return;
    heroEmblaApi.on("select", onHeroSlideChange);
  }, [heroEmblaApi, onHeroSlideChange]);

  const autoplay = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  );
  const [testimonialsEmbla, testimonialsEmblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [autoplay.current]
  );

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const onScroll = () => {
      const pos = el.scrollLeft;
      const newIndex = Math.round(pos / (cardWidth + 24));
      setIndex(newIndex);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (i) => {
    if (!scroller.current) return;
    scroller.current.scrollTo({
      left: i * (cardWidth + 24),
      behavior: "smooth",
    });
  };

  const next = () => scrollTo(Math.min(index + 1, cards.length - 1));
  const prev = () => scrollTo(Math.max(index - 1, 0));

  return (
    <div className="min-h-screen flex flex-col">

      <nav className="w-full pt-8 px-16 flex justify-between items-center flex-shrink-0 bg-[#FFB700]">
        <div className="text-black font-bold text-2xl">
          RentMe
        </div>
        <div className="flex gap-8">
          <Link href="\listings" className="text-black font-bold px-4 pb-0 pt-4">
            Explore items
          </Link>
          <Link href="/signin" className="text-white font-bold text-base px-4 py-2 border border-white rounded-xl">
            Login
          </Link>
          <Link href="/signup" className="text-white bg-black font-bold text-base px-4 py-2 rounded-xl">
            Sign Up
          </Link>

        </div>
      </nav>

      {/*hero section*/}
      <section className="w-full min-h-screen flex flex-col items-center justify-center px-16 relative bg-[#FFB700] overflow-hidden">
        {/* Center - Main heading and CTA */}
        <div className="flex flex-col items-center text-center z-10">
          <h1 className="text-7xl font-bold text-black mb-6 leading-tight">
            The Live Rental
            <br />
            Marketplace
          </h1>
          <p className="text-2xl text-black mb-12">
            Rent, list, and connect around the things you need.
          </p>
        </div>

        {/* Hero Infinite Carousel with Embla */}
        <div className="relative w-full mb-12">
          <div className="embla overflow-hidden" ref={heroEmbla}>
            <div className="embla__container flex gap-6">
              {/* Duplicated cards for infinite scroll effect - First set (copy of original) */}
              {/* Card 1 */}
              <Card className="flex-shrink-0 w-64 overflow-hidden border-0 p-0">
                <div className="relative w-full h-64 bg-blue-600 flex items-center justify-center text-6xl">
                  👜
                  <div className="absolute top-3 right-3 bg-[#FFB700] text-black font-bold px-3 py-1 rounded-lg text-lg">$25/day</div>
                </div>
                <CardContent className="pt-4 pb-4 px-4">
                  <CardTitle>Designer Bag</CardTitle>
                  <CardDescription>Perfect for travel</CardDescription>
                </CardContent>
              </Card>

              {/* Card 2 */}
              <Card className="flex-shrink-0 w-64 overflow-hidden border-0 p-0">
                <div className="relative w-full h-64 bg-pink-400 flex items-center justify-center text-6xl">
                  📚
                  <div className="absolute top-3 right-3 bg-[#FFB700] text-black font-bold px-3 py-1 rounded-lg text-lg">$5/day</div>
                </div>
                <CardContent className="pt-4 pb-4 px-4">
                  <CardTitle>Book Set</CardTitle>
                  <CardDescription>Expand your collection</CardDescription>
                </CardContent>
              </Card>

              {/* Card 3 */}
              <Card className="flex-shrink-0 w-64 overflow-hidden border-0 p-0">
                <div className="relative w-full h-64 bg-yellow-300 flex items-center justify-center text-6xl">
                  🎮
                  <div className="absolute top-3 right-3 bg-[#FFB700] text-black font-bold px-3 py-1 rounded-lg text-lg">$10/day</div>
                </div>
                <CardContent className="pt-4 pb-4 px-4">
                  <CardTitle>Gaming Console</CardTitle>
                  <CardDescription>Latest models available</CardDescription>
                </CardContent>
              </Card>

              {/* Card 4 */}
              <Card className="flex-shrink-0 w-64 overflow-hidden border-0 p-0">
                <div className="relative w-full h-64 bg-green-500 flex items-center justify-center text-6xl">
                  A mid bike
                  <div className="absolute top-3 right-3 bg-[#FFB700] text-black font-bold px-3 py-1 rounded-lg text-lg">$15/day</div>
                </div>
                <CardContent className="pt-4 pb-4 px-4">
                  <CardTitle>Mountain Bike</CardTitle>
                  <CardDescription>Adventure awaits</CardDescription>
                </CardContent>
              </Card>

              {/* Duplicated cards for infinite scroll effect - Second set (copy of original) */}
              {/* Card 1 */}
              <Card className="flex-shrink-0 w-64 overflow-hidden border-0 p-0">
                <div className="relative w-full h-64 bg-blue-600 flex items-center justify-center text-6xl">
                  👜
                  <div className="absolute top-3 right-3 bg-[#FFB700] text-black font-bold px-3 py-1 rounded-lg text-lg">$25/day</div>
                </div>
                <CardContent className="pt-4 pb-4 px-4">
                  <CardTitle>Designer Bag</CardTitle>
                  <CardDescription>Perfect for travel</CardDescription>
                </CardContent>
              </Card>

              {/* Card 2 */}
              <Card className="flex-shrink-0 w-64 overflow-hidden border-0 p-0">
                <div className="relative w-full h-64 bg-pink-400 flex items-center justify-center text-6xl">
                  📚
                  <div className="absolute top-3 right-3 bg-[#FFB700] text-black font-bold px-3 py-1 rounded-lg text-lg">$5/day</div>
                </div>
                <CardContent className="pt-4 pb-4 px-4">
                  <CardTitle>Book Set</CardTitle>
                  <CardDescription>Expand your collection</CardDescription>
                </CardContent>
              </Card>

              {/* Card 3 */}
              <Card className="flex-shrink-0 w-64 overflow-hidden border-0 p-0">
                <div className="relative w-full h-64 bg-yellow-300 flex items-center justify-center text-6xl">
                  🎮
                  <div className="absolute top-3 right-3 bg-[#FFB700] text-black font-bold px-3 py-1 rounded-lg text-lg">$10/day</div>
                </div>
                <CardContent className="pt-4 pb-4 px-4">
                  <CardTitle>Gaming Console</CardTitle>
                  <CardDescription>Latest models available</CardDescription>
                </CardContent>
              </Card>

              {/* Card 4 */}
              <Card className="flex-shrink-0 w-64 overflow-hidden border-0 p-0">
                <div className="relative w-full h-64 bg-green-500 flex items-center justify-center text-6xl">
                  A mid bike
                  <div className="absolute top-3 right-3 bg-[#FFB700] text-black font-bold px-3 py-1 rounded-lg text-lg">$15/day</div>
                </div>
                <CardContent className="pt-4 pb-4 px-4">
                  <CardTitle>Mountain Bike</CardTitle>
                  <CardDescription>Adventure awaits</CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Navigation buttons */}
          <button
            className="embla__button embla__button--prev absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 border border-gray-700 flex items-center justify-center shadow-md"
            onClick={onHeroPrevButtonClick}
            aria-label="Previous slide"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            className="embla__button embla__button--next absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 border border-gray-700 flex items-center justify-center shadow-md"
            onClick={onHeroNextButtonClick}
            aria-label="Next slide"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>


        </div>

        {/* How it works button */}
        <Link href="#how_it_works" className="bg-transparent text-black font-semibold px-8 py-3 rounded-full hover:bg-black hover:text-[#FFB700] transition-colors duration-300">
          See how it works ↓
        </Link>
      </section>

      {/*How it works section*/}
      <section
        id="how_it_works"
        className="w-full min-h-screen py-20 px-10 md:px-16 flex items-center"
        style={{ backgroundImage: "linear-gradient(0deg, rgb(237, 228, 100), rgb(255, 183, 0))" }}
      >
        <div className="max-w-7xl w-full mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Large headline */}
            <div className="lg:col-span-6">
              <span className="inline-block mb-6 text-sm text-[#FFA200] tracking-wide">
                How it works
              </span>

              <h2 className="text-[62px] leading-[1.02] font-extrabold text-black tracking-tight mb-6">
                Share More
                <br />
                Own less
              </h2>
              <p className="text-black max-w-xl">
                Turn Your Unused Items Into Income. Rent What You Need, When You Need It.
              </p>
            </div>

            {/* Right: carousel / cards */}
            <div className="lg:col-span-6 relative">
              <div className="relative">
                {/* Scrollable row */}
                <div
                  ref={scroller}
                  className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-6 px-2"
                  style={{ scrollBehavior: "smooth" }}
                >
                  {cards.map((c, i) => (
                    <article
                      key={i}
                      className="snap-start min-w-[360px] h-[300px] rounded-2xl p-8 flex flex-col justify-between
                               bg-[#FFB700]
                                "
                    >
                      {/* top art placeholder */}
                      <div className="flex-1 flex items-center justify-center">
                        <div className="w-36 h-28 rounded-lg bg-black/40 border border-gray-800 flex items-center justify-center">
                          {/* replace with SVG or image */}
                          <svg
                            width="64"
                            height="48"
                            viewBox="0 0 64 48"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="opacity-30"
                          >
                            <rect width="64" height="48" rx="6" fill="#111827" />
                          </svg>
                        </div>
                      </div>

                      {/* bottom text */}
                      <div>
                        <h4 className="text-black text-lg font-semibold mb-2">
                          {c.title}
                        </h4>
                        <p className="text-black text-sm">{c.subtitle}</p>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Prev / Next buttons */}

                <button
                  onClick={next}
                  aria-label="Next"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black border border-gray-700 flex items-center justify-center shadow-md"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

          </div>
        </div>


      </section>



      {/*user testimonials*/}
      <section id="testimonials" className="w-full min-h-screen bg-black py-20 px-16 flex flex-col items-center justify-center overflow-hidden border-b border-white"
        style={{ backgroundImage: "linear-gradient(180deg, rgb(237, 228, 100), rgb(255, 255, 255))" }}
      >
        <div className="max-w-6xl mx-auto text-center w-full mb-16">
          <h2 className="text-5xl font-bold tracking-tight mb-4 text-white">What Our Users Say</h2>

          <div className="flex flex-col items-center gap-3">
            <Stars count={5} size={20} />
            <div className="text-sm uppercase tracking-wide font-semibold text-[#FFB700]">
              4.9/5 FROM 1000+ REVIEWS
            </div>
          </div>
        </div>

        {/* Testimonials Carousel with Embla */}
        <div className="embla w-full overflow-hidden" ref={testimonialsEmbla}>
          <div className="embla__container flex gap-6">
            {reviews.map((r, idx) => (
              <article
                key={idx}
                className="embla__slide flex-shrink-0 min-w-0 w-96 bg-[#FFB700] text-white rounded-xl shadow-lg p-6 border border-gray-200"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Stars count={r.rating} size={16} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{r.title}</h3>
                <p className="text-white text-sm mb-4 line-clamp-3">{r.body}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white text-sm">{r.author}</p>
                  </div>
                  {r.verified && (
                    <span className="bg-[#FFB700] text-black text-xs font-bold px-2 py-1 rounded">
                      Verified
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>

      </section>


      {/*footer*/}
      <footer className="py-12 px-16 bg-white text-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Social Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-black">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-black transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-black hover:text-[#FFB700] transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.772.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.035-.058 1.351-.058 3.807v.468c0 2.456.011 2.772.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.035.047 1.351.058 3.807.058h.468c2.456 0 2.772-.011 3.807-.058.975-.045 1.504-.207 1.857-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.047-1.035.058-1.351.058-3.807v-.468c0-2.456-.011-2.772-.058-3.807-.045-.975-.207-1.504-.344-1.857a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.035-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-black hover:text-[#FFB700] transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-black hover:text-[#FFB700] transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl text-black font-bold mb-4">Our Office</h3>
            <address className="not-italic">
              <p className="mb-2">123 Innovation Drive</p>
              <p className="mb-2">San Francisco, CA 94107</p>
              <p className="mb-2">United States</p>
              <p className="mb-2">Email: info@rentme.com</p>
              <p>Phone: +1 (555) 123-4567</p>
            </address>
          </div>

          <div>
            <h3 className="text-xl text-black font-bold mb-4 text-[#FFB700]">RentMe</h3>
            <p className="mb-2">The premier rental marketplace connecting people with items they need.</p>
            <p className="text-sm text-black mt-4">&copy; {new Date().getFullYear()} RentMe. All rights reserved.</p>
          </div>
        </div>
      </footer>


    </div>
  )
}


