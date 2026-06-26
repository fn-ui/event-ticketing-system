import express from "express";
import { supabase }
  from "../config/supabase.js";
import {
  testDaraja,
  initiateSTKPush,
  createDarajaCheckout,
} from "../controllers/darajaController.js";
import {
  stkPushQueryService,
} from "../services/darajaService.js";
import {
  finalizePayment,
} from "../services/paymentFinalizer.js";

const router =
  express.Router();

/* ========================================
   TEST ROUTE
======================================== */

router.get(
  "/test",
  testDaraja
);

/* ========================================
   STK PUSH ROUTE
======================================== */

router.post(
  "/stkpush",
  initiateSTKPush
);

/* ========================================
   CHECKOUT (booking + payment + STK push)
======================================== */

router.post(
  "/checkout",
  createDarajaCheckout
);

/* ========================================
   CHECK PAYMENT STATUS
======================================== */

router.get(
  "/status/:transactionId",
  async (req, res) => {
    try {
      const {
        transactionId,
      } = req.params;

      const {
        data,
        error,
      } = await supabase
        .from("payments")
        .select("*")
        .eq(
          "transaction_id",
          transactionId
        )
        .single();

      if (error) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Payment not found",
          });
      }

      /* ========================================
         STILL PENDING -> ACTIVELY ASK SAFARICOM

         Don't rely on the callback ever
         arriving (sandbox callbacks can be
         delayed or never fire). Query Daraja
         directly and self-heal the row. This
         is the only path that resolves status
         in sandbox.
      ======================================== */

      if (
        data.status === "pending"
      ) {
        try {
          const queryResult =
            await stkPushQueryService(
              transactionId
            );

          const resultCode =
            Number(
              queryResult
                ?.ResultCode
            );

          /* ========================================
             GRACE PERIOD

             The sandbox query API can return a
             stray non-zero ResultCode (e.g.
             "cancelled") in the first few seconds,
             before the user has even seen the STK
             prompt on their phone. Give them real
             time to respond before trusting a
             failure result. Success is never
             delayed - only failure.
          ======================================== */

          const elapsedMs =
            Date.now() -
            new Date(
              data.created_at
            ).getTime();

          const FAILURE_GRACE_MS = 20000;

          if (resultCode === 0) {
            await finalizePayment(
              transactionId,
              "completed"
            );
          } else if (
            !Number.isNaN(
              resultCode
            ) &&
            elapsedMs >=
              FAILURE_GRACE_MS
          ) {
            await finalizePayment(
              transactionId,
              "failed"
            );
          }
        } catch (queryError) {
          /* STK push still being processed
             by Safaricom - keep polling */

          console.log(
            "STK QUERY (still pending):",
            queryError.response
              ?.data ||
              queryError.message
          );
        }
      }

      /* Re-read so the response always reflects
         the latest status, whichever path set it */

      const {
        data: latest,
      } = await supabase
        .from("payments")
        .select("status")
        .eq(
          "transaction_id",
          transactionId
        )
        .single();

      return res.status(200).json({
        status:
          latest?.status ||
          data.status,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,

        message:
          "Failed to fetch payment status",
      });
    }
  }
);

export default router;

