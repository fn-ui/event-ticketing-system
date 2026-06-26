import {
  initializePaystackService,
} from "../services/paystackService.js";

/* ========================================
   TEST CONTROLLER
======================================== */

export const testPaystack =
  async (req, res) => {
    try {
      res.status(200).json({
        success: true,

        message:
          "Paystack controller working",
      });
    } catch (error) {
      res.status(500).json({
        success: false,

        message:
          error.message,
      });
    }
  };

/* ========================================
   INITIALIZE PAYSTACK PAYMENT
======================================== */

export const initializePaystack =
  async (req, res) => {
    try {
      const {
        email,
        amount,
      } = req.body;

      const response =
        await initializePaystackService(
          {
            email,

            amount,

            callback_url:
              "https://event-ticketing-system-lovat.vercel.app/payment-success?method=paystack",

               metadata: {
              cancel_action:
                "https://event-ticketing-system-lovat.vercel.app/payment-failed",
            },
          }
        );

      res.status(200).json({
        success: true,

        data:
          response.data,
      });
    } catch (error) {
      console.log(
        error.response?.data ||
          error.message
      );

      res.status(500).json({
        success: false,

        message:
          error.response?.data
            ?.message ||
          error.message,
      });
    }
  };