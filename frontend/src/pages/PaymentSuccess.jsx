import { useEffect } from "react";

import {
  CheckCircle2,
} from "lucide-react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

function PaymentSuccess() {
  const navigate =
    useNavigate();

  const [
    searchParams,
  ] = useSearchParams();

  const method =
    searchParams.get(
      "method"
    );

  useEffect(() => {
    const timer =
      setTimeout(() => {
        navigate("/events");
      }, 4000);

    return () =>
      clearTimeout(timer);
  }, [navigate]);

  const paymentMessage =
    method === "daraja"
      ? "Your M-Pesa payment was completed successfully."
      : method ===
        "paystack"
      ? "Your Paystack payment was completed successfully."
      : "Your booking has been completed successfully.";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-xl rounded-[32px] bg-white p-12 text-center shadow-xl">
        {/* ICON */}

        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-14 w-14 text-green-600" />
        </div>

        {/* TITLE */}

        <h1 className="mt-8 text-5xl font-black text-slate-900">
          Payment Successful
        </h1>

        {/* MESSAGE */}

        <p className="mt-6 text-lg text-slate-500">
          {paymentMessage}
        </p>

        {/* REDIRECT */}

        <p className="mt-3 text-sm text-slate-400">
          Redirecting to events...
        </p>

        {/* BUTTON */}

        <button
          onClick={() =>
            navigate("/events")
          }
          className="mt-10 rounded-2xl bg-violet-700 px-8 py-4 font-bold text-white transition hover:bg-violet-800"
        >
          Go To Events
        </button>
      </div>
    </div>
  );
}

export default PaymentSuccess;