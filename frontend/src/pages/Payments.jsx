import { useState } from "react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

import {
  CreditCard,
  Smartphone,
  Wallet,
  Loader2,
} from "lucide-react";

import MainLayout from "../components/layout/MainLayout";

import {
  processDarajaPayment,
  processPaypalPayment,
  processPaystackPayment,
} from "../services/paymentService";

import { useAuth } from "../contexts/AuthContext";

function Payments() {
  const {
    user,
    profile,
  } = useAuth();

  const location =
    useLocation();

  const bookingData =
    location.state;

  const [
    loadingMethod,
    setLoadingMethod,
  ] = useState(null);

  const [error, setError] =
  useState("");

  /* ========================================
     VALIDATE BOOKING DATA
  ======================================== */

  if (!bookingData) {
    return (
      <MainLayout>
        <div className="container-width px-6 py-32 text-center">
          <h1 className="text-5xl font-black text-gray-900">
            No Payment Data
          </h1>

          <p className="mt-5 text-lg text-gray-500">
            Please select an event
            first.
          </p>
        </div>
      </MainLayout>
    );
  }

  /* ========================================
     HANDLE PAYMENT
  ======================================== */

  const handlePayment =
    async (method) => {
      try {
        if (
          !user ||
          !profile
        ) {
          setError(
            "Please login first"
          );

          return;
        }

        setLoadingMethod(
          method
        );

        let response;

            /* ========================================
            DARAJA PAYMENT
          ======================================== */

          if (
            method === "daraja"
          ) {
            response =
              await processDarajaPayment(
                {
                  phone:
                    bookingData.phone,

                  total:
                    bookingData.total,
                }
              );

            console.log(
              "Daraja Response:",
              response
            );

            /*
              DO NOT redirect yet.
              Wait for user to enter PIN on phone.
            */

            toast.success(
              "STK Push sent. Please enter your M-Pesa PIN on your phone."
            );

            return;
          }

        /* ========================================
           PAYPAL PAYMENT
        ======================================== */

        if (
          method === "paypal"
        ) {
          response =
            await processPaypalPayment(
              {
                total:
                  bookingData.total,
              }
            );

          console.log(
            "PayPal Response:",
            response
          );

          const approvalUrl =
            response?.data?.data
              ?.approval_url ||
            response?.data
              ?.approval_url;

          if (
            approvalUrl
          ) {
            /*
              Redirect user to PayPal
            */

            window.location.href =
              approvalUrl;

            return;
          }

          throw new Error(
            "PayPal checkout link not found"
          );
        }

        /* ========================================
           PAYSTACK PAYMENT
        ======================================== */

        if (
          method === "paystack"
        ) {
          response =
            await processPaystackPayment(
              {
                email:
                  user.email,

                total:
                  bookingData.total,
              }
            );

          console.log(
            "Paystack Response:",
            response
          );

          const authorizationUrl =
            response?.data?.data
              ?.authorization_url ||
            response?.data
              ?.authorization_url;

          if (
            authorizationUrl
          ) {
            /*
              Redirect user to Paystack checkout
            */

            window.location.href =
              authorizationUrl;

            return;
          }

          throw new Error(
            "Paystack checkout link not found"
          );
        }
      } catch (error) {
        console.error(
          error
        );

        setError(
          error.response?.data
            ?.message ||
            error.message ||
            "Payment failed"
        );
      } finally {
        setLoadingMethod(
          null
        );
      }
    };

  return (
    <MainLayout>
      <section className="py-20">
        <div className="container-width max-w-5xl px-6">
          {/* HEADER */}

          <div className="text-center">
            <h1 className="text-5xl font-black text-gray-900">
              Complete Payment
            </h1>

            <p className="mt-5 text-lg text-gray-600">
              Choose your preferred
              payment method.
            </p>
          </div>

          {/* EVENT SUMMARY */}

          <div className="mt-12 rounded-3xl bg-white p-8 shadow-xl">
            <div className="flex flex-col gap-8 lg:flex-row">
              <img
                src={
                  bookingData.event
                    .image
                }
                alt={
                  bookingData.event
                    .title
                }
                className="h-72 w-full rounded-3xl object-cover lg:w-96"
              />

              <div className="flex-1">
                <h2 className="text-4xl font-black text-gray-900">
                  {
                    bookingData.event
                      .title
                  }
                </h2>

                <p className="mt-5 text-lg text-gray-500">
                  {
                    bookingData.event
                      .location
                  }
                </p>

                <div className="mt-10 grid gap-5 sm:grid-cols-2">
                  <div className="rounded-2xl bg-gray-100 p-5">
                    <p className="text-sm font-medium text-gray-500">
                      Tickets
                    </p>

                    <h3 className="mt-2 text-3xl font-black text-gray-900">
                      {
                        bookingData.quantity
                      }
                    </h3>
                  </div>

                  <div className="rounded-2xl bg-violet-100 p-5">
                    <p className="text-sm font-medium text-violet-700">
                      Total Amount
                    </p>

                    <h3 className="mt-2 text-3xl font-black text-violet-700">
                      KSh{" "}
                      {
                        bookingData.total
                      }
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PAYMENT METHODS */}

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {/* DARAJA */}

            <button
              disabled={
                loadingMethod !==
                null
              }
              onClick={() =>
                handlePayment(
                  "daraja"
                )
              }
              className="rounded-3xl bg-white p-8 text-left shadow-xl transition duration-300 hover:-translate-y-2"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">
                {loadingMethod ===
                "daraja" ? (
                  <Loader2 className="h-8 w-8 animate-spin text-green-700" />
                ) : (
                  <Smartphone className="h-8 w-8 text-green-700" />
                )}
              </div>

              <h3 className="mt-6 text-3xl font-black text-gray-900">
                M-Pesa
              </h3>

              <p className="mt-4 text-gray-500">
                Pay using Daraja
                STK Push.
              </p>
            </button>

            {/* PAYPAL */}

            <button
              disabled={
                loadingMethod !==
                null
              }
              onClick={() =>
                handlePayment(
                  "paypal"
                )
              }
              className="rounded-3xl bg-white p-8 text-left shadow-xl transition duration-300 hover:-translate-y-2"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                {loadingMethod ===
                "paypal" ? (
                  <Loader2 className="h-8 w-8 animate-spin text-blue-700" />
                ) : (
                  <CreditCard className="h-8 w-8 text-blue-700" />
                )}
              </div>

              <h3 className="mt-6 text-3xl font-black text-gray-900">
                PayPal
              </h3>

              <p className="mt-4 text-gray-500">
                Secure international
                card payment.
              </p>
            </button>

            {/* PAYSTACK */}

            <button
              disabled={
                loadingMethod !==
                null
              }
              onClick={() =>
                handlePayment(
                  "paystack"
                )
              }
              className="rounded-3xl bg-white p-8 text-left shadow-xl transition duration-300 hover:-translate-y-2"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100">
                {loadingMethod ===
                "paystack" ? (
                  <Loader2 className="h-8 w-8 animate-spin text-purple-700" />
                ) : (
                  <Wallet className="h-8 w-8 text-purple-700" />
                )}
              </div>

              <h3 className="mt-6 text-3xl font-black text-gray-900">
                Paystack
              </h3>

              <p className="mt-4 text-gray-500">
                Fast African payment
                gateway.
              </p>
            </button>
          </div>


              {/* ERROR MESSAGE */}

              {
                error && (
                  <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
                    {error}
                  </div>
                )
              }
          {/* LOADING */}

          {loadingMethod && (
            <div className="mt-10 text-center">
              <h2 className="text-2xl font-black text-violet-700">
                Processing{" "}
                {
                  loadingMethod
                }{" "}
                payment...
              </h2>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}

export default Payments;