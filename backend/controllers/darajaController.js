import {
  stkPushService,
} from "../services/darajaService.js";

import { supabase }
  from "../config/supabase.js";

/* ========================================
   TEST CONTROLLER
======================================== */

export const testDaraja =
  async (req, res) => {
    try {
      res.status(200).json({
        success: true,

        message:
          "Daraja controller working",
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
   INITIATE STK PUSH
======================================== */

export const initiateSTKPush =
  async (req, res) => {
    try {
      const {
        phone,
        amount,
      } = req.body;

      console.log(
        "DARAJA REQUEST:",
        req.body
      );

      /* ========================================
         VALIDATION
      ======================================== */

      if (
        !phone ||
        !amount
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Phone and amount are required",
        });
      }

      /* ========================================
         INITIATE STK PUSH
      ======================================== */

      const response =
        await stkPushService({
          phone,

          amount,
        });

      console.log(
        "DARAJA SUCCESS:",
        response
      );

      /* ========================================
         RETURN RESPONSE
      ======================================== */

      return res.status(200).json({
        success: true,

        message:
          "STK Push initiated successfully",

        data: response,
      });
    } catch (error) {
      console.log(
        "DARAJA CONTROLLER ERROR:"
      );

      console.log(
        error.response?.data ||
          error.message
      );

      return res.status(500).json({
        success: false,

        message:
          error.response?.data
            ?.errorMessage ||
          error.message ||
          "Failed to initiate STK Push",
      });
    }
  };

/* ========================================
   CREATE BOOKING + INITIATE STK PUSH

   Owns the whole booking/payment write path
   server-side (service role key) so the
   browser never touches the bookings or
   payments tables directly.
======================================== */

export const createDarajaCheckout =
  async (req, res) => {
    let bookingId = null;

    try {
      const {
        userId,
        eventId,
        eventTitle,
        ticketQuantity,
        totalAmount,
        phone,
      } = req.body;

      if (
        !userId ||
        !eventId ||
        !ticketQuantity ||
        !totalAmount ||
        !phone
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
              "Daraja",
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
        console.log(
          "CREATE BOOKING ERROR:",
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
         INITIATE STK PUSH
      ======================================== */

      const stkResponse =
        await stkPushService({
          phone,
          amount: totalAmount,
        });

      const checkoutRequestId =
        stkResponse
          ?.CheckoutRequestID;

      if (!checkoutRequestId) {
        await supabase
          .from("bookings")
          .update({
            status: "failed",
          })
          .eq("id", bookingId);

        return res.status(502).json({
          success: false,

          message:
            "M-Pesa did not return a checkout request",
        });
      }

      /* ========================================
         CREATE PAYMENT (PENDING)
      ======================================== */

      const {
        error: paymentError,
      } = await supabase
        .from("payments")
        .insert([
          {
            booking_id: bookingId,
            user_id: userId,
            amount: totalAmount,
            payment_method:
              "Daraja",
            status: "pending",
            transaction_id:
              checkoutRequestId,
          },
        ]);

      if (paymentError) {
        console.log(
          "CREATE PAYMENT ERROR:",
          paymentError
        );

        return res.status(500).json({
          success: false,

          message:
            "Failed to record payment",
        });
      }

      await supabase
        .from("bookings")
        .update({
          transaction_id:
            checkoutRequestId,
        })
        .eq("id", bookingId);

      return res.status(200).json({
        success: true,

        checkoutRequestId,

        bookingId,
      });
    } catch (error) {
      console.log(
        "DARAJA CHECKOUT ERROR:",
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

      return res.status(500).json({
        success: false,

        message:
          error.response?.data
            ?.errorMessage ||
          error.message ||
          "Failed to initiate M-Pesa payment",
      });
    }
  };