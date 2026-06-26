import {
  stkPushService,
} from "../services/darajaService.js";

/* ========================================
   TEST CONTROLLER
======================================== */

export const testDaraja =
  async (req, res) => {
    try {
      res.status(200).json({
        success: true,

        message:
          "Daraja controller working",
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
   INITIATE STK PUSH
======================================== */

export const initiateSTKPush =
  async (req, res) => {
    try {
      const {
        phone,
        amount,
      } = req.body;

      console.log(
        "DARAJA REQUEST:",
        req.body
      );

      /* ========================================
         VALIDATION
      ======================================== */

      if (
        !phone ||
        !amount
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Phone and amount are required",
        });
      }

      /* ========================================
         INITIATE STK PUSH
      ======================================== */

      const response =
        await stkPushService({
          phone,

          amount,
        });

      console.log(
        "DARAJA SUCCESS:",
        response
      );

      /* ========================================
         RETURN RESPONSE
      ======================================== */

      return res.status(200).json({
        success: true,

        message:
          "STK Push initiated successfully",

        data: response,
      });
    } catch (error) {
      console.log(
        "DARAJA CONTROLLER ERROR:"
      );

      console.log(
        error.response?.data ||
          error.message
      );

      return res.status(500).json({
        success: false,

        message:
          error.response?.data
            ?.errorMessage ||
          error.message ||
          "Failed to initiate STK Push",
      });
    }
  };