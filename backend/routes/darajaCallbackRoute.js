import express from "express";

import { supabase }
  from "../config/supabase.js";

const router =
  express.Router();

/* ========================================
   DARAJA CALLBACK
======================================== */

router.post(
  "/callback",
  async (req, res) => {
    try {
      console.log(
        "========== DARAJA CALLBACK =========="
      );

      console.log(
        JSON.stringify(
          req.body,
          null,
          2
        )
      );

      const callback =
        req.body.Body
          ?.stkCallback;

      /* ========================================
         VALIDATE CALLBACK
      ======================================== */

      if (!callback) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "No callback data received",
          });
      }

      const resultCode =
        callback.ResultCode;

      const resultDesc =
        callback.ResultDesc;

      const checkoutRequestID =
        callback.CheckoutRequestID;

      const merchantRequestID =
        callback.MerchantRequestID;

      console.log(
        "RESULT CODE:",
        resultCode
      );

      console.log(
        "RESULT DESC:",
        resultDesc
      );

      console.log(
        "CHECKOUT REQUEST ID:",
        checkoutRequestID
      );

      console.log(
        "MERCHANT REQUEST ID:",
        merchantRequestID
      );

      /* ========================================
         PAYMENT SUCCESS
      ======================================== */

      if (resultCode === 0) {
        console.log(
          "PAYMENT SUCCESSFUL"
        );

        const callbackItems =
          callback.CallbackMetadata
            ?.Item || [];

        const amount =
          callbackItems.find(
            (item) =>
              item.Name ===
              "Amount"
          )?.Value;

        const mpesaReceipt =
          callbackItems.find(
            (item) =>
              item.Name ===
              "MpesaReceiptNumber"
          )?.Value;

        const phoneNumber =
          callbackItems.find(
            (item) =>
              item.Name ===
              "PhoneNumber"
          )?.Value;

        console.log(
          "AMOUNT:",
          amount
        );

        console.log(
          "MPESA RECEIPT:",
          mpesaReceipt
        );

        console.log(
          "PHONE:",
          phoneNumber
        );

        /* ========================================
           UPDATE PAYMENT STATUS
        ======================================== */

        const {
          error:
            updateError,
        } =
          await supabase
            .from(
              "payments"
            )
            .update({
              status:
                "completed",

              mpesa_receipt:
                mpesaReceipt,
            })
            .eq(
              "transaction_id",
              checkoutRequestID
            );

        if (
          updateError
        ) {
          console.log(
            "SUPABASE UPDATE ERROR:"
          );

          console.log(
            updateError
          );
        } else {
          console.log(
            "PAYMENT UPDATED TO COMPLETED"
          );
        }
      }

      /* ========================================
         PAYMENT FAILED
      ======================================== */

      else {
        console.log(
          "PAYMENT FAILED"
        );

        console.log(
          "FAILURE REASON:",
          resultDesc
        );

        /*
          Common failures:

          1 = Insufficient Funds
          1032 = User Cancelled
          1037 = Timeout
          Wrong PIN
        */

        /* ========================================
           UPDATE FAILED STATUS
        ======================================== */

        const {
          error:
            failedUpdateError,
        } =
          await supabase
            .from(
              "payments"
            )
            .update({
              status:
                "failed",
            })
            .eq(
              "transaction_id",
              checkoutRequestID
            );

        if (
          failedUpdateError
        ) {
          console.log(
            "FAILED STATUS UPDATE ERROR:"
          );

          console.log(
            failedUpdateError
          );
        } else {
          console.log(
            "PAYMENT UPDATED TO FAILED"
          );
        }
      }

      /* ========================================
         SAFARICOM RESPONSE
      ======================================== */

      return res.status(200).json({
        ResultCode: 0,

        ResultDesc:
          "Callback received successfully",
      });
    } catch (error) {
      console.log(
        "DARAJA CALLBACK ERROR:"
      );

      console.log(error);

      return res.status(500).json({
        success: false,

        message:
          "Callback processing failed",
      });
    }
  }
);

export default router;