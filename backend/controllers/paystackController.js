import {
  initializePaystackService,
  verifyPaystackService,
} from "../services/paystackService.js";

import { supabase } from "../config/supabase.js";

import {
  finalizePayment,
} from "../services/paymentFinalizer.js";

/* ========================================
   TEST CONTROLLER
======================================== */

export const testPaystack =
  async (req, res) => {
    try {
      res.status(200).json({
        success: true,

        message:
          "Paystack controller working",
      });
    } catch (error) {
      res.status(500).json({
        success: false,

        message:
          error.message,
      });
    }
  };

/* ========================================
   INITIALIZE PAYSTACK PAYMENT + BOOKING

   Owns the whole booking/payment write path
   server-side (service role key), mirroring
   the Daraja and PayPal checkout flows - the
   browser never marks a Paystack booking
   "completed" itself, only the verify step
   below does that, once Paystack confirms the
   transaction.
======================================== */

export const initializePaystack =
  async (req, res) => {
    let bookingId = null;

    try {
      const {
        userId,
        eventId,
        eventTitle,
        ticketQuantity,
        totalAmount,
        email,
      } = req.body;

      if (
        !userId ||
        !eventId ||
        !ticketQuantity ||
        !totalAmount ||
        !email
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Missing required booking fields",
        });
      }

      /* ========================================
         VERIFY TICKET AVAILABILITY
      ======================================== */

      const {
        data: event,
        error: eventError,
      } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();

      if (
        eventError ||
        !event
      ) {
        return res.status(404).json({
          success: false,

          message:
            "Event not found",
        });
      }

      if (
        event.tickets_available <
        ticketQuantity
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Not enough tickets available",
        });
      }

      /* ========================================
         CREATE BOOKING (PENDING)
      ======================================== */

      const {
        data: booking,
        error: bookingError,
      } = await supabase
        .from("bookings")
        .insert([
          {
            user_id: userId,
            event_id: eventId,
            event_title: eventTitle,
            ticket_quantity:
              ticketQuantity,
            total_amount:
              totalAmount,
            payment_method:
              "Paystack",
            transaction_id: null,
            status: "pending",
          },
        ])
        .select()
        .single();

      if (
        bookingError ||
        !booking
      ) {
        console.error(
          "PAYSTACK CREATE BOOKING ERROR:",
          bookingError
        );

        return res.status(500).json({
          success: false,

          message:
            "Failed to create booking",
        });
      }

      bookingId = booking.id;

      /* ========================================
         INITIALIZE TRANSACTION
      ======================================== */

      const response =
        await initializePaystackService(
          {
            email,

            amount:
              totalAmount,

            callback_url:
              "https://event-ticketing-system-lovat.vercel.app/payment-success?method=paystack",

            metadata: {
              cancel_action:
                "https://event-ticketing-system-lovat.vercel.app/payment-failed?method=paystack",
            },
          }
        );

      const authorizationUrl =
        response?.data
          ?.authorization_url;

      const reference =
        response?.data
          ?.reference;

      if (
        !authorizationUrl ||
        !reference
      ) {
        await supabase
          .from("bookings")
          .update({
            status: "failed",
          })
          .eq("id", bookingId);

        return res.status(502).json({
          success: false,

          message:
            "Paystack did not return a checkout link",
        });
      }

      /* ========================================
         RECORD PENDING PAYMENT
      ======================================== */

      await supabase
        .from("payments")
        .insert([
          {
            booking_id: bookingId,
            user_id: userId,
            amount: totalAmount,
            payment_method:
              "Paystack",
            status: "pending",
            transaction_id:
              reference,
          },
        ]);

      await supabase
        .from("bookings")
        .update({
          transaction_id:
            reference,
        })
        .eq("id", bookingId);

      res.status(200).json({
        success: true,

        authorization_url:
          authorizationUrl,

        reference,

        bookingId,
      });
    } catch (error) {
      console.error(
        "PAYSTACK INITIALIZE ERROR:",
        error.response?.data ||
          error.message
      );

      if (bookingId) {
        await supabase
          .from("bookings")
          .update({
            status: "failed",
          })
          .eq("id", bookingId);
      }

      res.status(500).json({
        success: false,

        message:
          error.response?.data
            ?.message ||
          error.message ||
          "Failed to initialize Paystack payment",
      });
    }
  };

/* ========================================
   VERIFY PAYSTACK PAYMENT

   Only finalizes the booking/payment as
   "completed" (and reduces ticket counts)
   once Paystack confirms the transaction
   actually succeeded - never before.
======================================== */

export const verifyPaystackPayment =
  async (req, res) => {
    const { reference } =
      req.params;

    try {
      if (!reference) {
        return res.status(400).json({
          success: false,

          message:
            "Missing Paystack transaction reference",
        });
      }

      const result =
        await verifyPaystackService(
          reference
        );

      const transactionStatus =
        result?.data
          ?.status;

      if (
        transactionStatus ===
        "success"
      ) {
        await finalizePayment(
          reference,
          "completed"
        );

        return res.status(200).json({
          success: true,

          status: "completed",
        });
      }

      await finalizePayment(
        reference,
        "failed"
      );

      return res.status(200).json({
        success: true,

        status: "failed",
      });
    } catch (error) {
      console.error(
        "PAYSTACK VERIFY ERROR:",
        error.response?.data ||
          error.message
      );

      if (reference) {
        await finalizePayment(
          reference,
          "failed"
        ).catch(() => {});
      }

      res.status(500).json({
        success: false,

        message:
          "Failed to verify Paystack payment",
      });
    }
  };
