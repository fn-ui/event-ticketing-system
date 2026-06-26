import api from "./api";

import { supabase } from "../lib/supabase";

/* ========================================
   DARAJA PAYMENT
======================================== */

export const processDarajaPayment =
  async (bookingData) => {
    try {
      const response =
        await api.post(
          "/daraja/stkpush",
          {
            phone:
              bookingData.phone,

            amount:
              bookingData.total,
          }
        );

                return {
            success:
              response.data
                ?.ResponseCode ===
              "0",

            method: "Daraja",

            message:
              response.data
                ?.CustomerMessage,

            checkoutRequestId:
              response.data
                ?.CheckoutRequestID,

            data: response.data,
          };
    } catch (error) {
      console.error(
        "Daraja payment error:",
        error.response?.data ||
          error.message
      );

      throw new Error(
        error.response?.data
          ?.message ||
          "Daraja payment failed"
      );
    }
  };

/* ========================================
   DARAJA BOOKING + CHECKOUT

   Backend owns the booking/payment writes
   (service role key) - the browser only
   gets back IDs to poll with, it never
   touches the bookings/payments tables.
======================================== */

export const initiateDarajaBooking =
  async ({
    userId,
    eventId,
    eventTitle,
    ticketQuantity,
    totalAmount,
    phone,
  }) => {
    try {
      const response =
        await api.post(
          "/daraja/checkout",
          {
            userId,
            eventId,
            eventTitle,
            ticketQuantity,
            totalAmount,
            phone,
          }
        );

      return response.data;
    } catch (error) {
      console.error(
        "Daraja checkout error:",
        error.response?.data ||
          error.message
      );

      throw new Error(
        error.response?.data
          ?.message ||
          "Daraja payment failed"
      );
    }
  };

/* ========================================
   PAYPAL PAYMENT
======================================== */

export const processPaypalPayment =
  async (bookingData) => {
    try {
      const response =
        await api.post(
          "/paypal/create-order",
          {
            amount:
              bookingData.total,
          }
        );

      console.log(
        "PayPal Backend Response:",
        response.data
      );

      return {
        success: true,
        method: "PayPal",
        data: response.data,
      };
    } catch (error) {
      console.error(
        "PayPal payment error:",
        error.response?.data ||
          error.message
      );

      throw new Error(
        error.response?.data
          ?.message ||
          "PayPal payment failed"
      );
    }
  };

/* ========================================
   PAYSTACK PAYMENT
======================================== */

export const processPaystackPayment =
  async (bookingData) => {
    try {
      const response =
        await api.post(
          "/paystack/initialize",
          {
            email:
              bookingData.email,

            amount:
              bookingData.total,
          }
        );

      return {
        success: true,
        method: "Paystack",
        data: response.data,
      };
    } catch (error) {
      console.error(
        "Paystack payment error:",
        error.response?.data ||
          error.message
      );

      throw new Error(
        error.response?.data
          ?.message ||
          "Paystack payment failed"
      );
    }
  };

/* ========================================
   CREATE PAYMENT
======================================== */

export async function createPayment(
  paymentData
) {
  const { data, error } =
    await supabase
      .from("payments")
      .insert([
        {
          booking_id:
            paymentData.booking_id,

          user_id:
            paymentData.user_id,

          amount:
            paymentData.amount,

          payment_method:
            paymentData.payment_method,

          status:
            paymentData.status ||
            "pending",

          transaction_id:
            paymentData.transaction_id,
        },
      ])
      .select()
      .single();

  if (error) {
    console.error(
      "Create payment error:",
      error
    );

    throw error;
  }

  return data;
}

/* ========================================
   GET ALL PAYMENTS
======================================== */

export async function getAllPayments() {
  const { data, error } =
    await supabase
      .from("payments")
      .select(
        `
        *,
        profiles (
          full_name,
          email
        ),
        bookings (
          id
        )
      `
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

  if (error) {
    console.error(
      "Get payments error:",
      error
    );

    throw error;
  }

  return data;
}

/* ========================================
   GET USER PAYMENTS
======================================== */

export async function getUserPayments(
  userId
) {
  const { data, error } =
    await supabase
      .from("payments")
      .select("*")
      .eq("user_id", userId)
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

  if (error) {
    console.error(
      "Get user payments error:",
      error
    );

    throw error;
  }

  return data;
}

/* ========================================
   UPDATE PAYMENT STATUS
======================================== */

export async function updatePaymentStatus(
  paymentId,
  status
) {
  const { data, error } =
    await supabase
      .from("payments")
      .update({
        status,
      })
      .eq("id", paymentId)
      .select()
      .single();

  if (error) {
    console.error(
      "Update payment status error:",
      error
    );

    throw error;
  }

  return data;
}

/* ========================================
   CHECK PAYMENT STATUS
======================================== */

export const checkPaymentStatus =
  async (
    transactionId
  ) => {
    try {
      const { data, error } =
        await supabase
          .from("payments")
          .select("status")
          .eq(
            "transaction_id",
            transactionId
          )
          .single();

      if (error) {
        throw error;
      }

      return data.status;
    } catch (error) {
      console.error(
        "Check payment status error:",
        error
      );

      return "pending";
    }
  };