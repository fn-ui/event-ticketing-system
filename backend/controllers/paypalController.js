import paypal from "@paypal/checkout-server-sdk";

import paypalClient from "../config/paypal.js";

import { supabase } from "../config/supabase.js";

import {
  finalizePayment,
} from "../services/paymentFinalizer.js";

/* ========================================
   CREATE PAYPAL ORDER + BOOKING

   Owns the whole booking/payment write path
   server-side (service role key), mirroring
   the Daraja checkout flow - the browser
   never marks a PayPal booking "completed"
   itself, only the capture step below does
   that, once PayPal confirms the money moved.
======================================== */

export const createPaypalOrder =
  async (
    req,
    res
  ) => {
    let bookingId = null;

    try {
      const {
        userId,
        eventId,
        eventTitle,
        ticketQuantity,
        totalAmount,
      } = req.body;

      if (
        !userId ||
        !eventId ||
        !ticketQuantity ||
        !totalAmount
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
              "PayPal",
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
          "PAYPAL CREATE BOOKING ERROR:",
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
         CREATE PAYPAL ORDER
      ======================================== */

      const request =
        new paypal.orders.OrdersCreateRequest();

      request.prefer(
        "return=representation"
      );

      request.requestBody({
        intent: "CAPTURE",

        purchase_units: [
          {
            amount: {
              currency_code:
                "USD",

              value:
                Number(
                  totalAmount
                ).toFixed(2),
            },
          },
        ],

        application_context:
          {
            brand_name:
              "EventPay",

            landing_page:
              "LOGIN",

            user_action:
              "PAY_NOW",

            return_url:
              "https://event-ticketing-system-lovat.vercel.app/paypal-success",

            cancel_url:
              "https://event-ticketing-system-lovat.vercel.app/paypal-cancel",
          },
      });

      const order =
        await paypalClient.execute(
          request
        );

      const orderID =
        order.result.id;

      const approvalUrl =
        order.result.links.find(
          (link) =>
            link.rel ===
            "approve"
        )?.href;

      if (!approvalUrl) {
        await supabase
          .from("bookings")
          .update({
            status: "failed",
          })
          .eq("id", bookingId);

        return res.status(502).json({
          success: false,

          message:
            "PayPal did not return an approval link",
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
              "PayPal",
            status: "pending",
            transaction_id: orderID,
          },
        ]);

      await supabase
        .from("bookings")
        .update({
          transaction_id: orderID,
        })
        .eq("id", bookingId);

      res.status(200).json({
        success: true,

        orderID,

        approval_url:
          approvalUrl,

        bookingId,
      });
    } catch (error) {

      console.error(
        "PAYPAL CREATE ORDER ERROR:",
        error
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
          "Failed to create PayPal order",
      });
    }
  };

/* ========================================
   CAPTURE PAYPAL PAYMENT

   Only finalizes the booking/payment as
   "completed" (and reduces ticket counts)
   once PayPal confirms the capture went
   through - never before.
======================================== */

export const capturePaypalPayment =
  async (
    req,
    res
  ) => {
    const { orderID } =
      req.body;

    try {

      if (!orderID) {
        return res.status(400).json({
          success: false,

          message:
            "Missing PayPal order ID",
        });
      }

      const request =
        new paypal.orders.OrdersCaptureRequest(
          orderID
        );

      request.requestBody({});

      const capture =
        await paypalClient.execute(
          request
        );

      if (
        capture.result
          ?.status !==
        "COMPLETED"
      ) {
        await finalizePayment(
          orderID,
          "failed"
        );

        return res.status(400).json({
          success: false,

          message:
            "PayPal payment was not completed",
        });
      }

      await finalizePayment(
        orderID,
        "completed"
      );

      res.status(200).json({
        success: true,

        data:
          capture.result,
      });
    } catch (error) {

      console.error(
        "PAYPAL CAPTURE ERROR:",
        error
      );

      if (orderID) {
        await finalizePayment(
          orderID,
          "failed"
        ).catch(() => {});
      }

      res.status(500).json({
        success: false,

        message:
          "Failed to capture PayPal payment",
      });
    }
  };

/* ========================================
   CANCEL PAYPAL ORDER

   PayPal redirects here when the user backs
   out of checkout - mark the pending booking
   as failed so it doesn't sit around as a
   ticket-reserving zombie row.
======================================== */

export const cancelPaypalOrder =
  async (
    req,
    res
  ) => {
    try {
      const { orderID } =
        req.body;

      if (!orderID) {
        return res.status(400).json({
          success: false,

          message:
            "Missing PayPal order ID",
        });
      }

      await finalizePayment(
        orderID,
        "failed"
      );

      res.status(200).json({
        success: true,
      });
    } catch (error) {
      console.error(
        "PAYPAL CANCEL ERROR:",
        error
      );

      res.status(500).json({
        success: false,

        message:
          "Failed to cancel PayPal order",
      });
    }
  };