import {
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  RefreshCcw,
  XCircle,
} from "lucide-react";

function PaymentFailed() {
  const [
    searchParams,
  ] = useSearchParams();

  const method =
    searchParams.get(
      "method"
    );

  const paymentMessage =
    method === "daraja"
      ? "Your M-Pesa payment failed, was cancelled, or you entered the wrong PIN."
      : method ===
        "paystack"
      ? "Your Paystack payment was declined or cancelled."
      : "Your payment was not completed or was declined.";

  return (
    <div className="flex min-h-screen items-center justify-center bg-red-50 px-6">
      <div className="w-full max-w-md rounded-[32px] bg-white p-10 text-center shadow-xl">
        {/* ICON */}

        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
          <XCircle className="h-14 w-14 text-red-600" />
        </div>

        {/* TITLE */}

        <h1 className="mt-8 text-4xl font-black text-red-600">
          Payment Failed
        </h1>

        {/* MESSAGE */}

        <p className="mt-4 leading-7 text-gray-500">
          {paymentMessage}
        </p>

        <p className="mt-2 text-gray-500">
          No money was charged.
        </p>

        {/* BUTTONS */}

        <div className="mt-10 flex flex-col gap-4">
          <button
            onClick={() =>
              window.history.back()
            }
            className="flex items-center justify-center gap-3 rounded-2xl bg-violet-700 px-6 py-4 font-semibold text-white transition hover:bg-violet-800"
          >
            <RefreshCcw className="h-5 w-5" />

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

export default PaymentFailed;