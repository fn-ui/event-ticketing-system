import { useEffect, useState } from "react";

import {
  CheckCircle2,
  Loader2,
} from "lucide-react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { verifyPaystackPayment } from "../services/paymentService";

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

  const reference =
    searchParams.get(
      "reference"
    ) ||
    searchParams.get(
      "trxref"
    );

  const needsVerification =
    method === "paystack" &&
    Boolean(reference);

  const [
    verifying,
    setVerifying,
  ] = useState(
    needsVerification
  );

  /* ========================================
     VERIFY PAYSTACK TRANSACTION

     Paystack only redirects here once the
     user finishes checkout - it doesn't mean
     the charge succeeded, so the booking is
     only finalized server-side once this
     verify call confirms it.
  ======================================== */

  useEffect(() => {
    if (!needsVerification) {
      return;
    }

    const verify =
      async () => {
        try {
          const result =
            await verifyPaystackPayment(
              reference
            );

          if (
            result?.status !==
            "completed"
          ) {
            navigate(
              "/payment-failed?method=paystack",
              { replace: true }
            );

            return;
          }
        } catch (error) {
          console.error(
            "Paystack verification error:",
            error
          );

          navigate(
            "/payment-failed?method=paystack",
            { replace: true }
          );

          return;
        } finally {
          setVerifying(false);
        }
      };

    verify();
  }, [
    needsVerification,
    reference,
    navigate,
  ]);

  useEffect(() => {
    if (verifying) {
      return;
    }

    const timer =
      setTimeout(() => {
        navigate("/events");
      }, 4000);

    return () =>
      clearTimeout(timer);
  }, [navigate, verifying]);

  const paymentMessage =
    method === "daraja"
      ? "Your M-Pesa payment was completed successfully."
      : method ===
        "paystack"
      ? "Your Paystack payment was completed successfully."
      : "Your booking has been completed successfully.";

  if (verifying) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-xl rounded-[32px] bg-white p-12 text-center shadow-xl">
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-violet-100">
            <Loader2 className="h-14 w-14 animate-spin text-violet-700" />
          </div>

          <h1 className="mt-8 text-4xl font-black text-slate-900">
            Verifying Payment
          </h1>

          <p className="mt-6 text-lg text-slate-500">
            Please wait while we
            confirm your Paystack
            transaction.
          </p>
        </div>
      </div>
    );
  }

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
