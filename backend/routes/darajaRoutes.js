import express from "express";

import {
  stkPushService,
} from "../services/darajaService.js";

const router =
  express.Router();

/* ========================================
   TEST ROUTE
======================================== */

router.get(
  "/test",
  (req, res) => {
    res.json({
      success: true,
      message:
        "Daraja route working",
    });
  }
);

/* ========================================
   REAL STK PUSH
======================================== */

router.post(
  "/stkpush",
  async (req, res) => {
    try {
      const {
        phone,
        amount,
      } = req.body;

      const response =
        await stkPushService({
          phone,
          amount,
        });

      return res.status(200).json(
        response
      );
    } catch (error) {
      console.error(
        error.response?.data ||
          error.message
      );

      return res.status(500).json({
        success: false,
        message:
          "STK Push failed",
        error:
          error.response?.data ||
          error.message,
      });
    }
  }
);

export default router;