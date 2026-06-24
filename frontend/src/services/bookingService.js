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
      .insert([
        {
          user_id:
            bookingData.user_id,

          event_id:
            bookingData.event_id,

          event_title:
            bookingData.event_title,

          ticket_quantity:
            bookingData.ticket_quantity,

          payment_method:
            bookingData.payment_method,

          transaction_id:
            bookingData.transaction_id,

          total_amount:
            bookingData.total_amount,

          status:
            bookingData.status ||
            "pending",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error(
        "Create booking error:",
        error
      );

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
      .select(`
        *,
        profiles (
          full_name,
          email
        ),
        events (
          title,
          image,
          location,
          date
        )
      `)
      .eq("user_id", userId)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Get user bookings error:",
        error
      );

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
      .select(`
        *,
        profiles (
          full_name,
          email
        ),
        events (
          title,
          image,
          location,
          date
        )
      `)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Get all bookings error:",
        error
      );

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

          transaction_id:
            paymentData.transaction_id,

          status:
            paymentData.status ||
            "pending",
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
  };

/* ========================================
   REDUCE TICKETS
======================================== */

export const reduceTickets =
  async (
    eventId,
    ticketsBooked
  ) => {
    /* GET CURRENT EVENT */

    const {
      data: event,
      error: fetchError,
    } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (fetchError) {
      console.error(
        "Fetch event error:",
        fetchError
      );

      throw fetchError;
    }

    /* PREVENT NEGATIVE TICKETS */

    if (
      event.tickets_available <
      ticketsBooked
    ) {
      throw new Error(
        "Not enough tickets available"
      );
    }

    /* UPDATE EVENT */

    const {
      data,
      error,
    } = await supabase
      .from("events")
      .update({
        tickets_available:
          event.tickets_available -
          ticketsBooked,

        tickets_sold:
          (event.tickets_sold ||
            0) + ticketsBooked,
      })
      .eq("id", eventId)
      .select()
      .single();

    if (error) {
      console.error(
        "Reduce tickets error:",
        error
      );

      throw error;
    }

    return data;
  };