import { Link } from "react-router-dom";

import {
  ArrowRight,
  CalendarDays,
  CreditCard,
  ShieldCheck,
  Ticket,
} from "lucide-react";

import MainLayout from "../components/layout/MainLayout";

import EventCard from "../components/events/EventCard";

const featuredEvents = [
  {
    id: 1,
    title: "Tech Summit 2026",
    description:
      "Join innovators, developers, and tech leaders for an immersive technology experience.",
    date: "12 Aug 2026",
    location: "Nairobi, Kenya",
    price: 2500,
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Music Festival",
    description:
      "Experience unforgettable live performances from top artists across Africa.",
    date: "22 Sep 2026",
    location: "Mombasa, Kenya",
    price: 3500,
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Business Expo",
    description:
      "Network with entrepreneurs, investors, and startup founders from across the region.",
    date: "5 Oct 2026",
    location: "Kisumu, Kenya",
    price: 1800,
    image:
      "https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=1200&auto=format&fit=crop",
  },
];

function Home() {
  return (
    <MainLayout>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        <div className="container-width grid items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:py-28">
          {/* Left */}
          <div>
            <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-violet-100 px-5 py-3 text-sm font-semibold text-violet-700">
              <Ticket className="h-5 w-5" />

              Smart Event Ticketing System
            </div>

            <h1 className="text-5xl font-black leading-tight text-gray-900 md:text-6xl">
              Book Amazing Events
              <span className="block text-violet-700">
                With Secure Payments
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-gray-600">
              Discover events, reserve tickets,
              and pay seamlessly using
              M-Pesa, PayPal, or Paystack —
              all in one modern platform.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-col gap-5 sm:flex-row">
              <Link
                to="/events"
                className="flex h-16 items-center justify-center gap-3 rounded-2xl bg-violet-700 px-8 font-semibold text-white transition hover:bg-violet-800"
              >
                Browse Events

                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                to="/register"
                className="flex h-16 items-center justify-center rounded-2xl border border-gray-300 bg-white px-8 font-semibold text-gray-800 transition hover:bg-gray-100"
              >
                Create Account
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-14 grid grid-cols-3 gap-6">
              <div>
                <h2 className="text-4xl font-black text-violet-700">
                  20K+
                </h2>

                <p className="mt-2 text-gray-500">
                  Tickets Sold
                </p>
              </div>

              <div>
                <h2 className="text-4xl font-black text-violet-700">
                  500+
                </h2>

                <p className="mt-2 text-gray-500">
                  Events Hosted
                </p>
              </div>

              <div>
                <h2 className="text-4xl font-black text-violet-700">
                  99%
                </h2>

                <p className="mt-2 text-gray-500">
                  Secure Payments
                </p>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="relative">
            <div className="absolute -top-10 -left-10 h-72 w-72 rounded-full bg-violet-300 opacity-30 blur-3xl"></div>

            <div className="absolute -right-10 bottom-0 h-72 w-72 rounded-full bg-fuchsia-300 opacity-30 blur-3xl"></div>

            <div className="relative overflow-hidden rounded-[40px] bg-white p-5 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop"
                alt="Event"
                className="h-[600px] w-full rounded-[32px] object-cover"
              />

              {/* Floating Card */}
              <div className="absolute bottom-10 left-10 right-10 rounded-3xl bg-white/95 p-6 shadow-xl backdrop-blur">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Afro Music Festival
                    </h3>

                    <p className="mt-2 text-gray-500">
                      Nairobi, Kenya
                    </p>
                  </div>

                  <div className="rounded-2xl bg-violet-700 px-5 py-4 text-white">
                    <p className="text-sm">
                      Starting From
                    </p>

                    <h2 className="text-2xl font-black">
                      KSh 3,500
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24">
        <div className="container-width px-6">
          {/* Header */}
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-5xl font-black text-gray-900">
              Everything You Need
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              A complete event booking and
              payment solution with secure
              integrations and modern user
              experience.
            </p>
          </div>

          {/* Cards */}
          <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Card */}
            <div className="rounded-[32px] bg-white p-10 shadow-sm transition hover:-translate-y-2 hover:shadow-xl">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-100 text-violet-700">
                <CalendarDays className="h-10 w-10" />
              </div>

              <h3 className="mt-8 text-3xl font-bold text-gray-900">
                Event Booking
              </h3>

              <p className="mt-5 leading-8 text-gray-600">
                Browse events, reserve
                tickets, and manage your
                bookings effortlessly.
              </p>
            </div>

            {/* Card */}
            <div className="rounded-[32px] bg-white p-10 shadow-sm transition hover:-translate-y-2 hover:shadow-xl">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-100 text-violet-700">
                <CreditCard className="h-10 w-10" />
              </div>

              <h3 className="mt-8 text-3xl font-bold text-gray-900">
                Multiple Payments
              </h3>

              <p className="mt-5 leading-8 text-gray-600">
                Support for M-Pesa,
                Paystack, and PayPal secure
                payment integrations.
              </p>
            </div>

            {/* Card */}
            <div className="rounded-[32px] bg-white p-10 shadow-sm transition hover:-translate-y-2 hover:shadow-xl">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-100 text-violet-700">
                <ShieldCheck className="h-10 w-10" />
              </div>

              <h3 className="mt-8 text-3xl font-bold text-gray-900">
                Secure Platform
              </h3>

              <p className="mt-5 leading-8 text-gray-600">
                Built with secure
                authentication, payment
                verification, and protected
                transactions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED EVENTS */}
      <section className="pb-24">
        <div className="container-width px-6">
          {/* Header */}
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h2 className="text-5xl font-black text-gray-900">
                Featured Events
              </h2>

              <p className="mt-4 text-lg text-gray-600">
                Explore trending events and
                reserve your tickets today.
              </p>
            </div>

            <Link
              to="/events"
              className="rounded-2xl bg-violet-700 px-8 py-4 font-semibold text-white transition hover:bg-violet-800"
            >
              View All Events
            </Link>
          </div>

          {/* Events */}
          <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {featuredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
              />
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default Home;