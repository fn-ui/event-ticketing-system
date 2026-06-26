import express from "express";
import { supabase }
  from "../config/supabase.js";
import {
  testDaraja,
  initiateSTKPush,
} from "../controllers/darajaController.js";

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

      return res.status(200).json(
        data
      );
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

