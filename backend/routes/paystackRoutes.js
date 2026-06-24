import express from "express";

import axios from "axios";

const router =
  express.Router();

/* TEST ROUTE */

router.get(
  "/test",
  (req, res) => {
    res.json({
      success: true,

      message:
        "Paystack route working",
    });
  }
);

/* INITIALIZE PAYMENT */

router.post(
  "/initialize",
  async (req, res) => {
    try {
      const {
        email,
        amount,
      } = req.body;

      const response =
        await axios.post(
          "https://api.paystack.co/transaction/initialize",
          {
            email,

            amount:
              amount * 100,

            callback_url:
              "http://localhost:5173/payment-success",
          },
          {
            headers: {
              Authorization:
                `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,

              "Content-Type":
                "application/json",
            },
          }
        );

      return res.status(200).json(
        response.data
      );
    } catch (error) {
      console.log(
        error.response?.data ||
          error.message
      );

      return res.status(500).json({
        success: false,

        message:
          error.response?.data
            ?.message ||
          error.message,
      });
    }
  }
);

export default router;