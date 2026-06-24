import {
  useEffect,
  useState,
} from "react";

import {
  CalendarDays,
  CreditCard,
  DollarSign,
  Ticket,
} from "lucide-react";

import MainLayout from "../components/layout/MainLayout";

import { useAuth } from "../contexts/AuthContext";

import { getUserBookings } from "../services/bookingService";

function Dashboard() {
  const { user } = useAuth();

  const [bookings, setBookings] =
    useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings =
    async () => {
      try {
        const data =
          await getUserBookings(
            user.id
          );

        setBookings(data);
      } catch (error) {
        console.error(error);
      }
    };

  const totalSpent =
    bookings.reduce(
      (
        total,
        booking
      ) =>
        total +
        Number(
          booking.amount
        ),
      0
    );

  return (
    <MainLayout>
      <section className="section-padding">
        <div className="container-width px-6">
          {/* HEADER */}
          <div>
            <h1 className="text-5xl font-black text-gray-900">
              Dashboard
            </h1>

            <p className="mt-4 text-lg text-gray-500">
              Welcome back,
              {" "}
              {
                user?.user_metadata
                  ?.full_name
              }
            </p>
          </div>

          {/* STATS */}
          <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {/* BOOKINGS */}
            <div className="rounded-3xl bg-white p-8 shadow-lg">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100">
                <Ticket className="h-8 w-8 text-violet-700" />
              </div>

              <p className="mt-6 text-gray-500">
                Total Bookings
              </p>

              <h2 className="mt-2 text-5xl font-black text-gray-900">
                {
                  bookings.length
                }
              </h2>
            </div>

            {/* SPENT */}
            <div className="rounded-3xl bg-white p-8 shadow-lg">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">
                <DollarSign className="h-8 w-8 text-green-700" />
              </div>

              <p className="mt-6 text-gray-500">
                Total Spent
              </p>

              <h2 className="mt-2 text-5xl font-black text-gray-900">
                KES
                {" "}
                {totalSpent}
              </h2>
            </div>

            {/* PAYMENTS */}
            <div className="rounded-3xl bg-white p-8 shadow-lg">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                <CreditCard className="h-8 w-8 text-blue-700" />
              </div>

              <p className="mt-6 text-gray-500">
                Payments
              </p>

              <h2 className="mt-2 text-5xl font-black text-gray-900">
                {
                  bookings.length
                }
              </h2>
            </div>

            {/* EVENTS */}
            <div className="rounded-3xl bg-white p-8 shadow-lg">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100">
                <CalendarDays className="h-8 w-8 text-orange-700" />
              </div>

              <p className="mt-6 text-gray-500">
                Events Joined
              </p>

              <h2 className="mt-2 text-5xl font-black text-gray-900">
                {
                  bookings.length
                }
              </h2>
            </div>
          </div>

          {/* RECENT BOOKINGS */}
          <div className="mt-16 rounded-3xl bg-white p-10 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black text-gray-900">
                Recent Activity
              </h2>
            </div>

            <div className="mt-10 space-y-6">
              {bookings
                .slice(0, 5)
                .map(
                  (
                    booking
                  ) => (
                    <div
                      key={
                        booking.id
                      }
                      className="flex flex-col gap-4 rounded-2xl border border-gray-100 p-6 lg:flex-row lg:items-center lg:justify-between"
                    >
                      <div>
                        <h3 className="text-xl font-black text-gray-900">
                          {
                            booking.event_title
                          }
                        </h3>

                        <p className="mt-2 text-gray-500">
                          Payment via
                          {" "}
                          {
                            booking.payment_method
                          }
                        </p>
                      </div>

                      <div className="text-left lg:text-right">
                        <h3 className="text-2xl font-black text-violet-700">
                          KES
                          {" "}
                          {
                            booking.amount
                          }
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                          {new Date(
                            booking.created_at
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )
                )}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default Dashboard;