import { useEffect, useState } from "react";

import {
  CheckCircle2,
  Loader2,
  XCircle,
} from "lucide-react";

import {
  useSearchParams,
  Link,
} from "react-router-dom";

import api from "../services/api";

import MainLayout from "../components/layout/MainLayout";

function PaypalSuccess() {
  const [searchParams] =
    useSearchParams();

  const token =
    searchParams.get(
      "token"
    );

  const [loading, setLoading] =
    useState(
      Boolean(token)
    );

  const [success, setSuccess] =
    useState(false);

  const [message, setMessage] =
    useState(
      token
        ? ""
        : "Missing PayPal transaction token."
    );

  useEffect(() => {
    if (!token) {
      return;
    }

    const capturePayment =
      async () => {
        try {
          const response =
            await api.post(
              "/paypal/capture",
              {
                orderID:
                  token,
              }
            );

          console.log(
            "PayPal Capture:",
            response.data
          );

          if (
            response.data
              .success
          ) {
            setSuccess(true);

            setMessage(
              "Your PayPal payment has been verified successfully."
            );
          } else {
            setSuccess(false);

            setMessage(
              "Payment verification failed."
            );
          }
        } catch (error) {
          console.error(
            error
          );

          setSuccess(false);

          setMessage(
            error.response?.data
              ?.message ||
              "Failed to verify PayPal payment."
          );
        } finally {
          setLoading(false);
        }
      };

    capturePayment();
  }, [token]);

  return (
    <MainLayout>
      <section className="flex min-h-screen items-center justify-center px-6 py-20">
        <div className="w-full max-w-2xl rounded-[32px] bg-white p-10 shadow-2xl">
          {/* LOADING */}

          {loading && (
            <div className="text-center">
              <div className="flex justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-violet-100">
                  <Loader2 className="h-12 w-12 animate-spin text-violet-700" />
                </div>
              </div>

              <h1 className="mt-8 text-4xl font-black text-gray-900">
                Verifying Payment
              </h1>

              <p className="mt-4 text-lg text-gray-500">
                Please wait while we
                confirm your PayPal
                transaction.
              </p>
            </div>
          )}

          {/* SUCCESS */}

          {!loading &&
            success && (
              <div className="text-center">
                <div className="flex justify-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-14 w-14 text-green-600" />
                  </div>
                </div>

                <h1 className="mt-8 text-4xl font-black text-green-600">
                  Payment Successful
                </h1>

                <p className="mt-4 text-lg text-gray-500">
                  {message}
                </p>

                <Link
                  to="/bookings"
                  className="mt-10 inline-flex items-center justify-center rounded-2xl bg-violet-700 px-8 py-4 text-lg font-bold text-white transition hover:bg-violet-800"
                >
                  View My Bookings
                </Link>
              </div>
            )}

          {/* FAILED */}

          {!loading &&
            !success && (
              <div className="text-center">
                <div className="flex justify-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
                    <XCircle className="h-14 w-14 text-red-600" />
                  </div>
                </div>

                <h1 className="mt-8 text-4xl font-black text-red-600">
                  Payment Failed
                </h1>

                <p className="mt-4 text-lg text-gray-500">
                  {message}
                </p>

                <Link
                  to="/events"
                  className="mt-10 inline-flex items-center justify-center rounded-2xl bg-gray-900 px-8 py-4 text-lg font-bold text-white transition hover:bg-black"
                >
                  Back to Events
                </Link>
              </div>
            )}
        </div>
      </section>
    </MainLayout>
  );
}

export default PaypalSuccess;