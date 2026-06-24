import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  Loader2,
  Smartphone,
  Wallet,
  X,
} from "lucide-react";

import {
  processDarajaPayment,
  processPaypalPayment,
  processPaystackPayment,
} from "../../services/paymentService";

import {
  createBooking,
  createPayment,
  reduceTickets,
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

  const total =
    tickets * event.price;

  
  /* ========================================
     HANDLE BOOKING
  ======================================== */

  const handleBooking =
    async () => {
      if (loading) {
        return;
      }

      if (
        !user ||
        !profile
      ) {
        alert(
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
                alert(
                  "This event is sold out"
                );

                return;
              }

              if (
                tickets >
                event.tickets_available
              ) {
                alert(
                  `Only ${event.tickets_available} tickets remaining`
                );

                return;
              }

              try {
                setProcessing(true);

                let paymentResponse;

                /* ========================================
                  CREATE BOOKING FIRST
                ======================================== */

                const booking =
                  await createBooking({
                    user_id: user.id,

                    event_id: event.id,

                    tickets,

                    total_amount:
                      total,

                    payment_method:
                      paymentMethod,

                    payment_status:
                      paymentMethod ===
                      "Daraja"
                        ? "pending"
                        : "paid",
                  });

                /* ========================================
                  DARAJA PAYMENT
                ======================================== */
       if (
          paymentMethod ===
          "Daraja"
        ) {
          if (!phone) {
            alert(
              "Enter M-Pesa phone number"
            );

            setProcessing(false);

            return;
          }

          paymentResponse =
            await processDarajaPayment(
              {
                total,
                phone,
              }
            );

          console.log(
            "Daraja Response:",
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
              "Daraja",

            status: "pending",

            transaction_id:
              paymentResponse
                ?.data
                ?.CheckoutRequestID,
          });

          alert(
            "STK Push sent successfully. Check your phone and enter your M-Pesa PIN."
          );

          setTimeout(() => {
            navigate(
              "/payment-success"
            );
          }, 2000);

          return;
        }

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
            event.tickets_available -
              tickets
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
            event.tickets_available -
              tickets
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

        alert(
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-[32px] bg-white p-8">
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
            onChange={(e) =>
              setPaymentMethod(
                e.target.value
              )
            }
            className="input-field mt-3"
          >
            <option>
              Daraja
            </option>

            <option>
              PayPal
            </option>

            <option>
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
      </div>
    </div>
  );
}

export default BookingModal;