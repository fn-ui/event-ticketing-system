import {
  useEffect,
  useState,
} from "react";

import {
  CalendarDays,
  CreditCard,
  MapPin,
  Ticket,
} from "lucide-react";

import MainLayout from "../components/layout/MainLayout";

import { useAuth } from "../contexts/AuthContext";

import { getUserBookings } from "../services/bookingService";

function Bookings() {
  const { user } = useAuth();

  const [bookings, setBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

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
      } finally {
        setLoading(false);
      }
    };

  return (
    <MainLayout>
      <section className="section-padding">
        <div className="container-width px-6">
          {/* HEADER */}
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <h1 className="text-5xl font-black text-gray-900">
                My Bookings
              </h1>

              <p className="mt-4 text-lg text-gray-500">
                Manage all your event
                bookings and payments.
              </p>
            </div>

            <div className="rounded-3xl bg-violet-50 px-8 py-5">
              <p className="text-sm font-semibold text-violet-700">
                Total Bookings
              </p>

              <h2 className="mt-2 text-4xl font-black text-violet-900">
                {
                  bookings.length
                }
              </h2>
            </div>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="mt-20 flex justify-center">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-violet-200 border-t-violet-700" />
            </div>
          )}

          {/* EMPTY */}
          {!loading &&
            bookings.length ===
              0 && (
              <div className="mt-20 rounded-3xl bg-white p-20 text-center shadow-lg">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-violet-100">
                  <Ticket className="h-12 w-12 text-violet-700" />
                </div>

                <h2 className="mt-8 text-3xl font-black text-gray-900">
                  No Bookings Yet
                </h2>

                <p className="mt-4 text-gray-500">
                  Your event bookings
                  will appear here.
                </p>
              </div>
            )}

          {/* BOOKINGS */}
          {!loading &&
            bookings.length >
              0 && (
              <div className="mt-14 grid gap-8">
                {bookings.map(
                  (
                    booking
                  ) => (
                    <div
                      key={
                        booking.id
                      }
                      className="rounded-3xl bg-white p-8 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
                    >
                      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                        {/* LEFT */}
                        <div>
                          <h2 className="text-3xl font-black text-gray-900">
                            {
                              booking.event_title
                            }
                          </h2>

                          <div className="mt-6 flex flex-wrap gap-6">
                            {/* TICKETS */}
                            <div className="flex items-center gap-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100">
                                <Ticket className="h-6 w-6 text-violet-700" />
                              </div>

                              <div>
                                <p className="text-sm text-gray-500">
                                  Tickets
                                </p>

                                <h4 className="font-bold text-gray-900">
                                  {
                                    booking.ticket_quantity
                                  }
                                </h4>
                              </div>
                            </div>

                            {/* PAYMENT */}
                            <div className="flex items-center gap-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100">
                                <CreditCard className="h-6 w-6 text-green-700" />
                              </div>

                              <div>
                                <p className="text-sm text-gray-500">
                                  Payment
                                </p>

                                <h4 className="font-bold text-gray-900">
                                  {
                                    booking.payment_method
                                  }
                                </h4>
                              </div>
                            </div>

                            {/* DATE */}
                            <div className="flex items-center gap-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
                                <CalendarDays className="h-6 w-6 text-blue-700" />
                              </div>

                              <div>
                                <p className="text-sm text-gray-500">
                                  Booked On
                                </p>

                                <h4 className="font-bold text-gray-900">
                                  {new Date(
                                    booking.created_at
                                  ).toLocaleDateString()}
                                </h4>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* RIGHT */}
                        <div className="flex flex-col items-start gap-5 lg:items-end">
                          <div className="rounded-2xl bg-violet-700 px-8 py-4 text-white">
                            <p className="text-sm">
                              Total Amount
                            </p>

                            <h2 className="mt-1 text-3xl font-black">
                              KES{" "}
                              {
                                booking.amount
                              }
                            </h2>
                          </div>

                          <span className="badge-success">
                            Payment Completed
                          </span>

                          <p className="max-w-xs break-all text-sm text-gray-500">
                            Transaction ID:
                            {" "}
                            {
                              booking.transaction_id
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
        </div>
      </section>
    </MainLayout>
  );
}

export default Bookings;