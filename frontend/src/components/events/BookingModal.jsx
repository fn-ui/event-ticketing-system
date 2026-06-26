import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import {
  CreditCard,
  Loader2,
  Smartphone,
  Wallet,
  X,
} from "lucide-react";

import {
  initiateDarajaBooking,
  processPaypalPayment,
  processPaystackPayment,
} from "../../services/paymentService";

import {
  createBooking,
  createPayment,
  reduceTickets,
  updateBookingStatus,
} from "../../services/bookingService";

import { useAuth } from "../../contexts/AuthContext";

function BookingModal({
  event,
  onClose,
}) {
  const {
    user,
    profile,
    loading,
  } = useAuth();


  const navigate =useNavigate();

  const [tickets, setTickets] =
    useState(1);

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState("Daraja");

  const [phone, setPhone] =
    useState("");

  const [
    processing,
    setProcessing,
  ] = useState(false);

  const [
    awaitingPayment,
    setAwaitingPayment,
  ] = useState(false);

  const [
    pollAttempt,
    setPollAttempt,
  ] = useState(0);

  const [error, setError] =
  useState("");

  const [success, setSuccess] =
  useState("");

  const total =
    tickets * event.price;

  const pollIntervalRef =
    useRef(null);

  useEffect(() => {
    return () => {
      if (
        pollIntervalRef.current
      ) {
        clearInterval(
          pollIntervalRef.current
        );
      }
    };
  }, []);


  /* ========================================
     CANCEL WAITING FOR PAYMENT
  ======================================== */

  const handleCancelWaiting =
    () => {
      if (
        pollIntervalRef.current
      ) {
        clearInterval(
          pollIntervalRef.current
        );

        pollIntervalRef.current =
          null;
      }

      setAwaitingPayment(false);

      onClose();
    };

  /* ========================================
     HANDLE BOOKING
  ======================================== */

  const handleBooking =
    async () => {
      setError("");
      setSuccess("");
      setAwaitingPayment(false);
      setPollAttempt(0);

      if (loading) {
        return;
      }

      if (
        !user ||
        !profile
      ) {
        setError(
       "Please login first"
         );

        return;
      }

      /* ========================================
         CHECK TICKETS
      ======================================== */

              if (
                event.tickets_available <=
                0
              ) {
                setError(
                  "This event is sold out"
                );

                return;
              }

              if (
                tickets >
                event.tickets_available
              ) {
                setError(
                  `Only ${event.tickets_available} tickets remaining`
                );

                return;
              }

              try {
                setProcessing(true);

                let paymentResponse;

                /* ========================================
                    DARAJA PAYMENT

                    The backend (service role key) owns
                    creating the booking + payment rows
                    and initiating the STK push - the
                    browser never writes to Supabase for
                    this flow.
                  ======================================== */

                  if (
                    paymentMethod ===
                    "Daraja"
                  ) {
                    if (!phone) {
                      setError(
                        "Enter M-Pesa phone number"
                      );

                      setProcessing(false);

                      return;
                    }

                    const checkout =
                      await initiateDarajaBooking({
                        userId: user.id,
                        eventId: event.id,
                        eventTitle:
                          event.title,
                        ticketQuantity:
                          tickets,
                        totalAmount: total,
                        phone,
                      });

                    console.log(
                      "Daraja Checkout:",
                      checkout
                    );

                    const checkoutRequestID =
                      checkout
                        ?.checkoutRequestId;

                    if (!checkoutRequestID) {
                      throw new Error(
                        "Failed to start M-Pesa payment"
                      );
                    }

                    setSuccess("");

                    setAwaitingPayment(
                      true
                    );

                    setPollAttempt(0);

                    /* ========================================
                      START PAYMENT STATUS CHECKING

                      Daraja's callback can be delayed
                      or never arrive (sandbox is known
                      to be unreliable), so the backend
                      status endpoint actively queries
                      Safaricom instead of waiting on it.
                      Safaricom's sandbox rate-limits the
                      query API to 5 requests/60s (~1 every
                      12s) - 10s intervals run slightly
                      above that, so repeated rapid testing
                      can still trip the spike-arrest limit.
                      Still cap the polling so the modal
                      can't hang open forever.
                    ======================================== */

                    let pollAttempts = 0;

                    const MAX_POLL_ATTEMPTS = 12; // ~2 minutes at 10s intervals

                    pollIntervalRef.current =
                      setInterval(
                        async () => {
                          pollAttempts += 1;

                          setPollAttempt(
                            pollAttempts
                          );

                          try {
                            const response =
                              await api.get(
                                `/daraja/status/${checkoutRequestID}`
                              );

                            console.log(
                              "PAYMENT STATUS:",
                              response.data
                            );

                            const payment =
                              response.data;

                            /* SUCCESS */

                            if (
                              payment.status ===
                              "completed"
                            ) {
                              clearInterval(
                                pollIntervalRef.current
                              );

                              pollIntervalRef.current =
                                null;

                              setAwaitingPayment(
                                false
                              );

                              onClose();

                              navigate(
                                "/payment-success?method=daraja"
                              );

                              return;
                            }

                            /* FAILED */

                            if (
                              payment.status ===
                              "failed"
                            ) {
                              clearInterval(
                                pollIntervalRef.current
                              );

                              pollIntervalRef.current =
                                null;

                              setAwaitingPayment(
                                false
                              );

                              onClose();

                              navigate(
                                "/payment-failed?method=daraja"
                              );

                              return;
                            }
                          } catch (error) {
                            console.log(error);
                          }

                          /* TIMEOUT */

                          if (
                            pollAttempts >=
                            MAX_POLL_ATTEMPTS
                          ) {
                            clearInterval(
                              pollIntervalRef.current
                            );

                            pollIntervalRef.current =
                              null;

                            setAwaitingPayment(
                              false
                            );

                            setError(
                              "We couldn't confirm your M-Pesa payment yet. If you completed the prompt on your phone, check 'My Bookings' in a few minutes - it will update automatically once Safaricom confirms it."
                            );
                          }
                        },
                        10000
                      );

                    return;
                  }

                /* ========================================
                  CREATE BOOKING FIRST (PayPal / Paystack)
                ======================================== */

                const booking =
                  await createBooking({
                    user_id: user.id,

                    event_id: event.id,

                    event_title:
                      event.title,

                    ticket_quantity:
                      tickets,

                    total_amount:
                      total,

                    payment_method:
                      paymentMethod,

                    transaction_id:
                      null,

                    status: "pending",
                  });

        /* ========================================
           PAYPAL PAYMENT
        ======================================== */

        if (
          paymentMethod ===
          "PayPal"
        ) {
          paymentResponse =
            await processPaypalPayment(
              {
                total,
              }
            );

          console.log(
            "PayPal Response:",
            paymentResponse
          );

          /* SAVE PAYMENT */

          await createPayment({
            booking_id:
              booking.id,

              user_id:
              user.id,

            amount: total,

            payment_method:
              "PayPal",

            status:
              "completed",

            transaction_id:
              paymentResponse
                ?.data
                ?.orderID,
          });

          /* REDUCE TICKETS */

          await reduceTickets(
          event.id,
          tickets
            );

          await updateBookingStatus(
            booking.id,
            "completed"
          );

          const approvalUrl =
            paymentResponse?.data
              ?.data
              ?.approval_url ||
            paymentResponse?.data
              ?.approval_url;

          if (approvalUrl) {
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
          paymentMethod ===
          "Paystack"
        ) {
          paymentResponse =
            await processPaystackPayment(
              {
                total,
                email:
                  user.email,
              }
            );

          console.log(
            "Paystack Response:",
            paymentResponse
          );

          /* SAVE PAYMENT */

          await createPayment({
            booking_id:
              booking.id,

              user_id:
              user.id,

            amount: total,

            payment_method:
              "Paystack",

            status:
              "completed",

            transaction_id:
              paymentResponse
                ?.data
                ?.reference,
          });

          /* REDUCE TICKETS */

          await reduceTickets(
            event.id,
            tickets
          );

          await updateBookingStatus(
            booking.id,
            "completed"
          );

          const authorizationUrl =
            paymentResponse?.data
              ?.data
              ?.authorization_url ||
            paymentResponse?.data
              ?.authorization_url;

          if (
            authorizationUrl
          ) {
            window.location.href =
              authorizationUrl;

            return;
          }

          throw new Error(
            "Paystack checkout link not found"
          );
        }
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data
            ?.message ||
            error.message ||
            "Payment failed"
        );
      } finally {
        setProcessing(false);
      }
    };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
  <div className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-[32px] bg-white p-6 md:p-8">
        {/* HEADER */}

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-black text-gray-900">
              Book Event
            </h2>

            <p className="mt-2 text-gray-500">
              Complete your booking
              securely.
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 transition hover:bg-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* EVENT */}

        <div className="mt-8 overflow-hidden rounded-[28px] border border-gray-200">
          <img
            src={event.image}
            alt={event.title}
            className="h-56 w-full object-cover"
          />

          <div className="p-6">
            <h3 className="text-3xl font-black text-gray-900">
              {event.title}
            </h3>

            <p className="mt-3 text-gray-500">
              {event.location}
            </p>

            <div className="mt-5 flex items-center justify-between">
              <div className="inline-flex rounded-full bg-violet-100 px-5 py-2 font-bold text-violet-700">
                KES {event.price} per
                ticket
              </div>

              <div className="rounded-full bg-green-100 px-5 py-2 font-bold text-green-700">
                {
                  event.tickets_available
                }{" "}
                tickets left
              </div>
            </div>
          </div>
        </div>

        {awaitingPayment ? (
          /* ========================================
             WAITING FOR M-PESA CONFIRMATION
          ======================================== */

          <div className="mt-8 flex flex-col items-center rounded-[28px] bg-violet-50 p-10 text-center">
            <div className="relative flex h-20 w-20 items-center justify-center">
              <span className="absolute inline-flex h-20 w-20 animate-ping rounded-full bg-violet-400 opacity-50" />

              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-violet-700">
                <Smartphone className="h-8 w-8 text-white" />
              </div>
            </div>

            <h3 className="mt-6 text-2xl font-black text-gray-900">
              Check Your Phone
            </h3>

            <p className="mt-3 max-w-sm text-gray-500">
              Enter your M-Pesa PIN on{" "}
              <span className="font-semibold text-gray-700">
                {phone}
              </span>{" "}
              to pay KES {total}.
            </p>

            <div className="mt-6 flex items-center gap-2 text-violet-700">
              <Loader2 className="h-5 w-5 animate-spin" />

              <span className="font-semibold">
                Waiting for confirmation
                {pollAttempt > 0
                  ? ` (${pollAttempt * 10}s)`
                  : ""}
                ...
              </span>
            </div>

            <button
              onClick={
                handleCancelWaiting
              }
              className="mt-8 text-sm font-semibold text-gray-400 transition hover:text-gray-600"
            >
              Close (check "My Bookings" later)
            </button>
          </div>
        ) : (
          <>
            {/* TICKETS */}

            <div className="mt-8">
              <label className="font-bold text-gray-700">
                Number of Tickets
              </label>

              <input
                type="number"
                min="1"
                max={
                  event.tickets_available
                }
                value={tickets}
                disabled={
                  processing
                }
                onChange={(e) =>
                  setTickets(
                    Number(
                      e.target.value
                    )
                  )
                }
                className="input-field mt-3"
              />
            </div>

            {/* PHONE */}

            {paymentMethod ===
              "Daraja" && (
              <div className="mt-8">
                <label className="font-bold text-gray-700">
                  M-Pesa Phone Number
                </label>

                <input
                  type="text"
                  placeholder="254712345678"
                  value={phone}
                  disabled={
                    processing
                  }
                  onChange={(e) =>
                    setPhone(
                      e.target.value
                    )
                  }
                  className="input-field mt-3"
                />
              </div>
            )}

            {/* PAYMENT METHOD */}

            <div className="mt-8">
              <label className="font-bold text-gray-700">
                Payment Method
              </label>

              <select
                value={
                  paymentMethod
                }
                disabled={
                  processing
                }
                onChange={(e) =>
                  setPaymentMethod(
                    e.target.value
                  )
                }
                className="input-field mt-3"
              >
                <option value="Daraja">
                  M-Pesa
                </option>

                <option>
                  PayPal
                </option>

                 <option value="Paystack">
                  Paystack
                </option>
              </select>
            </div>

            {/* TOTAL */}

            <div className="mt-8 rounded-[28px] bg-violet-50 p-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-gray-900">
                  Total Amount
                </h3>

                <h3 className="text-4xl font-black text-violet-700">
                  KES {total}
                </h3>
              </div>
            </div>


              {
                error && (
                  <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
                    {error}
                  </div>
                )
              }

              {
                success && (
                  <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-600">
                    {success}
                  </div>
                )
              }

            {/* BUTTON */}

            <button
              onClick={
                handleBooking
              }
              disabled={processing}
              className="primary-btn mt-8 flex w-full items-center justify-center"
            >
              {processing ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />

                  Processing...
                </>
              ) : (
                <>
                  {paymentMethod ===
                  "Daraja" ? (
                    <Smartphone className="mr-3 h-5 w-5" />
                  ) : paymentMethod ===
                    "Paystack" ? (
                    <Wallet className="mr-3 h-5 w-5" />
                  ) : (
                    <CreditCard className="mr-3 h-5 w-5" />
                  )}

                  Pay with{" "}
                  {paymentMethod}
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default BookingModal;