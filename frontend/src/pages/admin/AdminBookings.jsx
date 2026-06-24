import { useEffect, useState } from "react";

import AdminLayout from "../../components/dashboard/AdminLayout";

import {
  CalendarDays,
  CreditCard,
  Mail,
  Search,
  Ticket,
} from "lucide-react";

import {
  getAllBookings,
} from "../../services/bookingService";

function AdminBookings() {
  const [bookings, setBookings] =
    useState([]);

  const [filteredBookings, setFilteredBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredBookings(
        bookings
      );

      return;
    }

    const filtered =
      bookings.filter(
        (booking) =>
          booking?.profiles?.full_name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          booking?.events?.title
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    setFilteredBookings(
      filtered
    );
  }, [search, bookings]);

  async function fetchBookings() {
    try {
      const data =
        await getAllBookings();

      setBookings(
        data || []
      );

      setFilteredBookings(
        data || []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* HEADER */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <h1 className="text-5xl font-black text-gray-900">
              Bookings
            </h1>

            <p className="mt-3 text-lg text-gray-500">
              Manage user bookings
              and ticket purchases.
            </p>
          </div>

          {/* SEARCH */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Search bookings..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="input-field pl-14"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-[32px] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="px-8 py-6 text-left text-sm font-bold uppercase tracking-wide text-gray-500">
                    User
                  </th>

                  <th className="px-8 py-6 text-left text-sm font-bold uppercase tracking-wide text-gray-500">
                    Event
                  </th>

                  <th className="px-8 py-6 text-left text-sm font-bold uppercase tracking-wide text-gray-500">
                    Tickets
                  </th>

                  <th className="px-8 py-6 text-left text-sm font-bold uppercase tracking-wide text-gray-500">
                    Amount
                  </th>

                  <th className="px-8 py-6 text-left text-sm font-bold uppercase tracking-wide text-gray-500">
                    Payment
                  </th>

                  <th className="px-8 py-6 text-left text-sm font-bold uppercase tracking-wide text-gray-500">
                    Date
                  </th>

                  <th className="px-8 py-6 text-left text-sm font-bold uppercase tracking-wide text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-8 py-14 text-center text-gray-500"
                    >
                      Loading bookings...
                    </td>
                  </tr>
                ) : filteredBookings.length ===
                  0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-8 py-14 text-center text-gray-500"
                    >
                      No bookings found.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map(
                    (
                      booking
                    ) => (
                      <tr
                        key={
                          booking.id
                        }
                        className="border-b border-gray-100 transition hover:bg-gray-50"
                      >
                        {/* USER */}
                        <td className="px-8 py-6">
                          <div>
                            <h3 className="font-bold text-gray-900">
                              {
                                booking
                                  ?.profiles
                                  ?.full_name
                              }
                            </h3>

                            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                              <Mail className="h-4 w-4" />

                              {
                                booking
                                  ?.profiles
                                  ?.email
                              }
                            </div>
                          </div>
                        </td>

                        {/* EVENT */}
                        <td className="px-8 py-6">
                          <div>
                            <h3 className="font-bold text-gray-900">
                              {
                                booking
                                  ?.events
                                  ?.title
                              }
                            </h3>

                            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                              <CalendarDays className="h-4 w-4" />

                              {
                                booking
                                  ?.events
                                  ?.date
                              }
                            </div>
                          </div>
                        </td>

                        {/* TICKETS */}
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 font-semibold text-gray-700">
                            <Ticket className="h-4 w-4 text-violet-600" />

                            {
                              booking.ticket_quantity
                            }
                          </div>
                        </td>

                        {/* AMOUNT */}
                        <td className="px-8 py-6 font-bold text-violet-700">
                          KSh{" "}
                          {
                            booking.amount
                          }
                        </td>

                        {/* PAYMENT */}
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 font-semibold text-gray-700">
                            <CreditCard className="h-4 w-4 text-violet-600" />

                            {
                              booking.payment_method
                            }
                          </div>
                        </td>

                        {/* DATE */}
                        <td className="px-8 py-6 text-gray-600">
                          {new Date(
                            booking.created_at
                          ).toLocaleDateString()}
                        </td>

                        {/* STATUS */}
                        <td className="px-8 py-6">
                          <span
                            className={`inline-flex rounded-full px-4 py-2 text-sm font-bold ${
                              booking.payment_status ===
                              "paid"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {
                              booking.payment_status
                            }
                          </span>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminBookings;