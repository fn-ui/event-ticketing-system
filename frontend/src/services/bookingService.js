import { supabase } from "../lib/supabase";

/* ========================================
   CREATE BOOKING
======================================== */

export const createBooking =
  async (bookingData) => {
    const {
      data,
      error,
    } = await supabase
      .from("bookings")
      .insert([bookingData])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  };

/* ========================================
   GET USER BOOKINGS
======================================== */

export const getUserBookings =
  async (userId) => {
    const {
      data,
      error,
    } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      throw error;
    }

    return data;
  };

/* ========================================
   GET ALL BOOKINGS
======================================== */

export const getAllBookings =
  async () => {
    const {
      data,
      error,
    } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      throw error;
    }

    return data;
  };

/* ========================================
   CREATE PAYMENT
======================================== */

export const createPayment =
  async (paymentData) => {
    const {
      data,
      error,
    } = await supabase
      .from("payments")
      .insert([paymentData])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  };

/* ========================================
   REDUCE TICKETS
======================================== */

export const reduceTickets =
  async (
    eventId,
    remainingTickets
  ) => {
    const {
      data,
      error,
    } = await supabase
      .from("events")
      .update({
        tickets_available:
          remainingTickets,
      })
      .eq("id", eventId)
      .select();

    if (error) {
      throw error;
    }

    return data;
  };