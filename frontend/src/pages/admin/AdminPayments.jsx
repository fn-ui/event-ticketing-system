import { useEffect, useMemo, useState } from "react";

import AdminLayout from "../../components/dashboard/AdminLayout";

import {
  CreditCard,
  DollarSign,
  Search,
  Wallet,
} from "lucide-react";

import {
  getAllPayments,
} from "../../services/paymentService";

function AdminPayments() {
  const [payments, setPayments] =
    useState([]);

  const [filteredPayments, setFilteredPayments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredPayments(
        payments
      );

      return;
    }

    const filtered =
      payments.filter(
        (payment) =>
          payment?.profiles?.full_name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          payment?.events?.title
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          payment?.payment_method
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    setFilteredPayments(
      filtered
    );
  }, [search, payments]);

  async function fetchPayments() {
    try {
      const data =
        await getAllPayments();

      setPayments(
        data || []
      );

      setFilteredPayments(
        data || []
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

  const paidPayments =
    payments.filter(
      (payment) =>
        payment.status ===
        "paid"
    ).length;

  const pendingPayments =
    payments.filter(
      (payment) =>
        payment.status ===
        "pending"
    ).length;

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* HEADER */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <h1 className="text-5xl font-black text-gray-900">
              Payments
            </h1>

            <p className="mt-3 text-lg text-gray-500">
              Track all payment
              transactions and revenue.
            </p>
          </div>

          {/* SEARCH */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Search payments..."
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

        {/* STATS */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {/* TOTAL REVENUE */}
          <div className="rounded-[32px] bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-500">
                  Total Revenue
                </p>

                <h2 className="mt-4 text-4xl font-black text-gray-900">
                  KSh{" "}
                  {totalRevenue.toLocaleString()}
                </h2>
              </div>

              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-100 text-violet-700">
                <DollarSign className="h-10 w-10" />
              </div>
            </div>
          </div>

          {/* TOTAL PAYMENTS */}
          <div className="rounded-[32px] bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-500">
                  Total Payments
                </p>

                <h2 className="mt-4 text-4xl font-black text-gray-900">
                  {
                    payments.length
                  }
                </h2>
              </div>

              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-100 text-blue-700">
                <CreditCard className="h-10 w-10" />
              </div>
            </div>
          </div>

          {/* PAID */}
          <div className="rounded-[32px] bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-500">
                  Successful
                </p>

                <h2 className="mt-4 text-4xl font-black text-gray-900">
                  {
                    paidPayments
                  }
                </h2>
              </div>

              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-green-100 text-green-700">
                <Wallet className="h-10 w-10" />
              </div>
            </div>
          </div>

          {/* PENDING */}
          <div className="rounded-[32px] bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-500">
                  Pending
                </p>

                <h2 className="mt-4 text-4xl font-black text-gray-900">
                  {
                    pendingPayments
                  }
                </h2>
              </div>

              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-yellow-100 text-yellow-700">
                <CreditCard className="h-10 w-10" />
              </div>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-[32px] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="px-8 py-6 text-left text-sm font-bold uppercase tracking-wide text-gray-500">
                    Customer
                  </th>

                  <th className="px-8 py-6 text-left text-sm font-bold uppercase tracking-wide text-gray-500">
                    Event
                  </th>

                  <th className="px-8 py-6 text-left text-sm font-bold uppercase tracking-wide text-gray-500">
                    Method
                  </th>

                  <th className="px-8 py-6 text-left text-sm font-bold uppercase tracking-wide text-gray-500">
                    Amount
                  </th>

                  <th className="px-8 py-6 text-left text-sm font-bold uppercase tracking-wide text-gray-500">
                    Transaction ID
                  </th>

                  <th className="px-8 py-6 text-left text-sm font-bold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-8 py-6 text-left text-sm font-bold uppercase tracking-wide text-gray-500">
                    Date
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
                      Loading payments...
                    </td>
                  </tr>
                ) : filteredPayments.length ===
                  0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-8 py-14 text-center text-gray-500"
                    >
                      No payments found.
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map(
                    (
                      payment
                    ) => (
                      <tr
                        key={
                          payment.id
                        }
                        className="border-b border-gray-100 transition hover:bg-gray-50"
                      >
                        {/* USER */}
                        <td className="px-8 py-6">
                          <div>
                            <h3 className="font-bold text-gray-900">
                              {
                                payment
                                  ?.profiles
                                  ?.full_name
                              }
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                              {
                                payment
                                  ?.profiles
                                  ?.email
                              }
                            </p>
                          </div>
                        </td>

                        {/* EVENT */}
                        <td className="px-8 py-6 font-semibold text-gray-700">
                          {
                            payment
                              ?.events
                              ?.title
                          }
                        </td>

                        {/* METHOD */}
                        <td className="px-8 py-6">
                          <span className="rounded-full bg-violet-100 px-4 py-2 text-sm font-bold text-violet-700">
                            {
                              payment.payment_method
                            }
                          </span>
                        </td>

                        {/* AMOUNT */}
                        <td className="px-8 py-6 font-black text-violet-700">
                          KSh{" "}
                          {
                            payment.amount
                          }
                        </td>

                        {/* TX ID */}
                        <td className="px-8 py-6 text-gray-600">
                          {
                            payment.transaction_id
                          }
                        </td>

                        {/* STATUS */}
                        <td className="px-8 py-6">
                          <span
                            className={`inline-flex rounded-full px-4 py-2 text-sm font-bold ${
                              payment.status ===
                              "paid"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {
                              payment.status
                            }
                          </span>
                        </td>

                        {/* DATE */}
                        <td className="px-8 py-6 text-gray-600">
                          {new Date(
                            payment.created_at
                          ).toLocaleDateString()}
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

export default AdminPayments;