import { supabase } from "../config/supabase.js";

/* ========================================
   FINALIZE PAYMENT

   Atomically transitions a payment out of
   "pending" exactly once (the .eq("status",
   "pending") guard acts as a mutex so the
   callback and the active status-query path
   can't both apply side effects), then
   reduces ticket availability and confirms
   the booking.
======================================== */

export async function finalizePayment(
  transactionId,
  outcome,
  extra = {}
) {
  const {
    data: payment,
    error,
  } = await supabase
    .from("payments")
    .update({
      status: outcome,
      ...extra,
    })
    .eq(
      "transaction_id",
      transactionId
    )
    .eq("status", "pending")
    .select()
    .single();

  if (error || !payment) {
    /* Already finalized by the other path (callback vs query), or not found */
    return null;
  }

  if (!payment.booking_id) {
    return payment;
  }

  if (outcome === "completed") {
    const {
      data: booking,
    } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", payment.booking_id)
      .single();

    if (booking) {
      const {
        data: event,
      } = await supabase
        .from("events")
        .select("*")
        .eq("id", booking.event_id)
        .single();

      if (event) {
        await supabase
          .from("events")
          .update({
            tickets_available:
              Math.max(
                event.tickets_available -
                  booking.ticket_quantity,
                0
              ),

            tickets_sold:
              (event.tickets_sold ||
                0) +
              booking.ticket_quantity,
          })
          .eq("id", event.id);
      }

      await supabase
        .from("bookings")
        .update({
          status: "completed",
        })
        .eq("id", booking.id);
    }
  } else {
    await supabase
      .from("bookings")
      .update({
        status: "failed",
      })
      .eq("id", payment.booking_id);
  }

  return payment;
}
