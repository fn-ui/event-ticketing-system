import { useEffect } from "react";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import { XCircle } from "lucide-react";

import { cancelPaypalPayment } from "../services/paymentService";

function PaypalCancel() {
  const [searchParams] =
    useSearchParams();

  useEffect(() => {
    const token =
      searchParams.get(
        "token"
      );

    if (token) {
      cancelPaypalPayment(
        token
      );
    }

    const timer =
      setTimeout(() => {
        window.location.href =
          "/events";
      }, 4000);

    return () =>
      clearTimeout(timer);
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-red-50 px-6">
      <div className="w-full max-w-md rounded-[32px] bg-white p-10 text-center shadow-xl">
        {/* ICON */}
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
          <XCircle className="h-14 w-14 text-red-600" />
        </div>

        {/* TITLE */}
        <h1 className="mt-8 text-4xl font-black text-red-600">
          Payment Cancelled
        </h1>

        {/* MESSAGE */}
        <p className="mt-4 leading-7 text-gray-500">
          Your PayPal payment was
          cancelled. No money was
          charged.
        </p>

        {/* REDIRECT TEXT */}
        <p className="mt-4 text-sm text-gray-400">
          Redirecting to events in
          4 seconds...
        </p>

        {/* BUTTONS */}
        <div className="mt-10 flex flex-col gap-4">
          <button
            onClick={() =>
              window.history.back()
            }
            className="rounded-2xl bg-violet-700 px-6 py-4 font-semibold text-white transition hover:bg-violet-800"
          >
            Try Again
          </button>

          <Link
            to="/events"
            className="rounded-2xl border border-gray-300 px-6 py-4 font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            Back to Events
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PaypalCancel;