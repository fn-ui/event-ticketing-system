import { useEffect, useMemo, useState } from "react";

import AdminLayout from "../../components/dashboard/AdminLayout";

import {
  BarChart3,
  CalendarDays,
  CreditCard,
  DollarSign,
  Download,
  Ticket,
  Users,
} from "lucide-react";

import {
  getAllBookings,
} from "../../services/bookingService";

import {
  getEvents,
} from "../../services/eventService";

import {
  getAllPayments,
} from "../../services/paymentService";

import {
  getAllUsers,
} from "../../services/userService";

function AdminReports() {
  const [users, setUsers] =
    useState([]);

  const [events, setEvents] =
    useState([]);

  const [bookings, setBookings] =
    useState([]);

  const [payments, setPayments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [
        usersData,
        eventsData,
        bookingsData,
        paymentsData,
      ] =
        await Promise.all([
          getAllUsers(),
          getEvents(),
          getAllBookings(),
          getAllPayments(),
        ]);

      setUsers(
        usersData || []
      );

      setEvents(
        eventsData || []
      );

      setBookings(
        bookingsData || []
      );

      setPayments(
        paymentsData || []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const totalRevenue =
    useMemo(() => {
      return payments.reduce(
        (
          total,
          payment
        ) =>
          total +
          Number(
            payment.amount
          ),
        0
      );
    }, [payments]);

  const totalTickets =
    useMemo(() => {
      return bookings.reduce(
        (
          total,
          booking
        ) =>
          total +
          Number(
            booking.ticket_quantity
          ),
        0
      );
    }, [bookings]);

  const paystackPayments =
    payments.filter(
      (payment) =>
        payment.payment_method ===
        "Paystack"
    ).length;

  const paypalPayments =
    payments.filter(
      (payment) =>
        payment.payment_method ===
        "PayPal"
    ).length;

  const mpesaPayments =
    payments.filter(
      (payment) =>
        payment.payment_method ===
        "M-Pesa"
    ).length;

  function exportReport() {
    const reportData = `
EVENT TICKETING SYSTEM REPORT

-----------------------------------

TOTAL USERS: ${
      users.length
    }

TOTAL EVENTS: ${
      events.length
    }

TOTAL BOOKINGS: ${
      bookings.length
    }

TOTAL TICKETS SOLD: ${totalTickets}

TOTAL PAYMENTS: ${
      payments.length
    }

TOTAL REVENUE: KSh ${totalRevenue}

-----------------------------------

PAYMENT METHODS

Paystack: ${paystackPayments}

PayPal: ${paypalPayments}

M-Pesa: ${mpesaPayments}

-----------------------------------

Generated On:
${new Date().toLocaleString()}
`;

    const blob =
      new Blob(
        [reportData],
        {
          type: "text/plain",
        }
      );

    const url =
      window.URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download =
      "event-report.txt";

    link.click();
  }

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* HEADER */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <h1 className="text-5xl font-black text-gray-900">
              Reports
            </h1>

            <p className="mt-3 text-lg text-gray-500">
              System analytics,
              revenue insights, and
              reports overview.
            </p>
          </div>

          <button
            onClick={
              exportReport
            }
            className="primary-btn flex items-center gap-3"
          >
            <Download className="h-5 w-5" />

            Export Report
          </button>
        </div>

        {/* STATS */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {/* USERS */}
          <div className="rounded-[32px] bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-500">
                  Total Users
                </p>

                <h2 className="mt-4 text-4xl font-black text-gray-900">
                  {
                    users.length
                  }
                </h2>
              </div>

              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-100 text-violet-700">
                <Users className="h-10 w-10" />
              </div>
            </div>
          </div>

          {/* EVENTS */}
          <div className="rounded-[32px] bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-500">
                  Events
                </p>

                <h2 className="mt-4 text-4xl font-black text-gray-900">
                  {
                    events.length
                  }
                </h2>
              </div>

              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-100 text-blue-700">
                <CalendarDays className="h-10 w-10" />
              </div>
            </div>
          </div>

          {/* BOOKINGS */}
          <div className="rounded-[32px] bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-500">
                  Tickets Sold
                </p>

                <h2 className="mt-4 text-4xl font-black text-gray-900">
                  {
                    totalTickets
                  }
                </h2>
              </div>

              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-green-100 text-green-700">
                <Ticket className="h-10 w-10" />
              </div>
            </div>
          </div>

          {/* REVENUE */}
          <div className="rounded-[32px] bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-500">
                  Revenue
                </p>

                <h2 className="mt-4 text-4xl font-black text-gray-900">
                  KSh{" "}
                  {totalRevenue.toLocaleString()}
                </h2>
              </div>

              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-yellow-100 text-yellow-700">
                <DollarSign className="h-10 w-10" />
              </div>
            </div>
          </div>
        </div>

        {/* PAYMENT ANALYTICS */}
        <div className="grid gap-8 xl:grid-cols-2">
          {/* PAYMENT METHODS */}
          <div className="rounded-[32px] bg-white p-10 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-100 text-violet-700">
                <CreditCard className="h-8 w-8" />
              </div>

              <div>
                <h2 className="text-3xl font-black text-gray-900">
                  Payment Methods
                </h2>

                <p className="mt-2 text-gray-500">
                  Distribution of
                  payments by platform.
                </p>
              </div>
            </div>

            {/* PAYSTACK */}
            <div className="mt-10">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-bold text-gray-700">
                  Paystack
                </h3>

                <span className="font-bold text-violet-700">
                  {
                    paystackPayments
                  }
                </span>
              </div>

              <div className="h-4 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-violet-600"
                  style={{
                    width: `${
                      payments.length
                        ? (paystackPayments /
                            payments.length) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            {/* PAYPAL */}
            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-bold text-gray-700">
                  PayPal
                </h3>

                <span className="font-bold text-blue-700">
                  {
                    paypalPayments
                  }
                </span>
              </div>

              <div className="h-4 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{
                    width: `${
                      payments.length
                        ? (paypalPayments /
                            payments.length) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            {/* MPESA */}
            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-bold text-gray-700">
                  M-Pesa
                </h3>

                <span className="font-bold text-green-700">
                  {
                    mpesaPayments
                  }
                </span>
              </div>

              <div className="h-4 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-green-600"
                  style={{
                    width: `${
                      payments.length
                        ? (mpesaPayments /
                            payments.length) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* RECENT BOOKINGS */}
          <div className="rounded-[32px] bg-white p-10 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-100 text-blue-700">
                <BarChart3 className="h-8 w-8" />
              </div>

              <div>
                <h2 className="text-3xl font-black text-gray-900">
                  Recent Activity
                </h2>

                <p className="mt-2 text-gray-500">
                  Latest booking and
                  payment activity.
                </p>
              </div>
            </div>

            <div className="mt-10 space-y-6">
              {loading ? (
                <p className="text-gray-500">
                  Loading...
                </p>
              ) : bookings.length ===
                0 ? (
                <p className="text-gray-500">
                  No activity found.
                </p>
              ) : (
                bookings
                  .slice(0, 6)
                  .map(
                    (
                      booking
                    ) => (
                      <div
                        key={
                          booking.id
                        }
                        className="flex items-center justify-between rounded-2xl border border-gray-100 p-5"
                      >
                        <div>
                          <h3 className="font-bold text-gray-900">
                            {
                              booking
                                ?.profiles
                                ?.full_name
                            }
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            booked{" "}
                            {
                              booking
                                ?.events
                                ?.title
                            }
                          </p>
                        </div>

                        <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
                          Paid
                        </div>
                      </div>
                    )
                  )
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminReports;