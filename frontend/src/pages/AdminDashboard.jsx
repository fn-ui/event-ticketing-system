import {
  CalendarDays,
  CreditCard,
  DollarSign,
  Users,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import AdminLayout from "../components/dashboard/AdminLayout";

import {
  getEvents,
} from "../services/eventService";

import {
  getAllBookings,
} from "../services/bookingService";

import {
  getAllPayments,
} from "../services/paymentService";

import {
  getAllUsers,
} from "../services/userService";

function AdminDashboard() {
  const [events, setEvents] =
    useState([]);

  const [users, setUsers] =
    useState([]);

  const [
    bookings,
    setBookings,
  ] = useState([]);

  const [
    payments,
    setPayments,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  /* ========================================
     FETCH DASHBOARD DATA
  ======================================== */

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData =
    async () => {
      try {
        setLoading(true);

                const [
          eventsData,
          usersData,
          bookingsData,
          paymentsData,
        ] = await Promise.all([
          getEvents(),
          getAllUsers(),
          getAllBookings(),
          getAllPayments(),
        ]);


        setEvents(
          eventsData || []
        );

        setUsers(
          usersData || []
        );

        setBookings(
          bookingsData || []
        );

        setPayments(
          paymentsData || []
        );
      } catch (error) {
        console.error(
          "Dashboard fetch error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

  /* ========================================
     TOTAL REVENUE
  ======================================== */

  const totalRevenue =
    useMemo(() => {
      return payments.reduce(
        (sum, payment) =>
          sum +
          Number(
            payment.amount || 0
          ),
        0
      );
    }, [payments]);

  /* ========================================
     PAYMENT METHOD PERCENTAGES
  ======================================== */

  const paymentStats =
    useMemo(() => {
      const total =
        payments.length;

      const paystack =
        payments.filter(
          (p) =>
            p.payment_method ===
            "Paystack"
        ).length;

      const paypal =
        payments.filter(
          (p) =>
            p.payment_method ===
            "PayPal"
        ).length;

      const daraja =
        payments.filter(
          (p) =>
            p.payment_method ===
            "Daraja"
        ).length;

      return {
        paystack:
          total > 0
            ? Math.round(
                (paystack /
                  total) *
                  100
              )
            : 0,

        paypal:
          total > 0
            ? Math.round(
                (paypal /
                  total) *
                  100
              )
            : 0,

        daraja:
          total > 0
            ? Math.round(
                (daraja /
                  total) *
                  100
              )
            : 0,
      };
    }, [payments]);

  /* ========================================
     STATS
  ======================================== */

  const stats = [
    {
      title:
        "Total Events",

      value:
        events.length,

      icon:
        CalendarDays,
    },

    {
      title:
        "Total Users",

      value:
        users.length,

      icon: Users,
    },

    {
      title:
        "Bookings",

      value:
        bookings.length,

      icon:
        CreditCard,
    },

    {
      title:
        "Revenue",

      value: `KSh ${totalRevenue.toLocaleString()}`,

      icon:
        DollarSign,
    },
  ];

  return (
    <AdminLayout>
      {/* HEADER */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-black text-slate-900">
            Admin Dashboard
          </h1>

          <p className="mt-4 text-lg text-slate-500">
            Manage events,
            payments,
            bookings, and
            users.
          </p>
        </div>
      </div>

      {/* LOADING */}

      {loading ? (
        <div className="mt-20 text-center text-xl font-bold text-violet-700">
          Loading dashboard...
        </div>
      ) : (
        <>
          {/* STATS */}

          <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {stats.map(
              (stat) => {
                const Icon =
                  stat.icon;

                return (
                  <div
                    key={
                      stat.title
                    }
                    className="rounded-[32px] bg-white p-8 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-semibold text-slate-500">
                          {
                            stat.title
                          }
                        </p>

                        <h2 className="mt-4 text-4xl font-black text-slate-900">
                          {
                            stat.value
                          }
                        </h2>
                      </div>

                      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-100 text-violet-700">
                        <Icon className="h-10 w-10" />
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>

          {/* TABLES */}

          <div className="mt-14 grid gap-10 xl:grid-cols-2">
            {/* RECENT BOOKINGS */}

            <div className="rounded-[32px] bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black text-slate-900">
                  Recent
                  Bookings
                </h2>
              </div>

              <div className="mt-8 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="pb-4 text-left text-sm font-bold text-slate-500">
                        USER
                      </th>

                      <th className="pb-4 text-left text-sm font-bold text-slate-500">
                        EVENT
                      </th>

                      <th className="pb-4 text-left text-sm font-bold text-slate-500">
                        AMOUNT
                      </th>

                      <th className="pb-4 text-left text-sm font-bold text-slate-500">
                        STATUS
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {payments
                      .slice(0, 5)
                      .map(
                        (
                          payment
                        ) => (
                          <tr
                            key={
                              payment.id
                            }
                            className="border-b"
                          >
                            <td className="py-5">
                              {payment
                                ?.profiles
                                ?.full_name ||
                                "Unknown"}
                            </td>

                            <td className="py-5">
                              {payment
                                ?.bookings
                                ?.event_title ||
                                "Event"}
                            </td>

                            <td className="py-5">
                              KSh{" "}
                              {Number(
                                payment.amount
                              ).toLocaleString()}
                            </td>

                            <td className="py-5">
                              <span
                                className={`rounded-full px-4 py-2 text-sm font-bold ${
                                  payment.status ===
                                  "completed"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {
                                  payment.status
                                }
                              </span>
                            </td>
                          </tr>
                        )
                      )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PAYMENT METHODS */}

            <div className="rounded-[32px] bg-white p-8 shadow-sm">
              <h2 className="text-3xl font-black text-slate-900">
                Payment
                Methods
              </h2>

              <div className="mt-10 space-y-8">
                {/* PAYSTACK */}

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-bold">
                      Paystack
                    </span>

                    <span className="font-bold text-violet-700">
                      {
                        paymentStats.paystack
                      }
                      %
                    </span>
                  </div>

                  <div className="h-4 overflow-hidden rounded-full bg-slate-200">
                    <div
                      style={{
                        width: `${paymentStats.paystack}%`,
                      }}
                      className="h-full rounded-full bg-violet-700"
                    />
                  </div>
                </div>

                {/* PAYPAL */}

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-bold">
                      PayPal
                    </span>

                    <span className="font-bold text-blue-600">
                      {
                        paymentStats.paypal
                      }
                      %
                    </span>
                  </div>

                  <div className="h-4 overflow-hidden rounded-full bg-slate-200">
                    <div
                      style={{
                        width: `${paymentStats.paypal}%`,
                      }}
                      className="h-full rounded-full bg-blue-600"
                    />
                  </div>
                </div>

                {/* MPESA */}

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-bold">
                      M-Pesa
                    </span>

                    <span className="font-bold text-green-600">
                      {
                        paymentStats.daraja
                      }
                      %
                    </span>
                  </div>

                  <div className="h-4 overflow-hidden rounded-full bg-slate-200">
                    <div
                      style={{
                        width: `${paymentStats.daraja}%`,
                      }}
                      className="h-full rounded-full bg-green-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}

export default AdminDashboard;