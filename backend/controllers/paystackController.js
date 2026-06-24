import {
  initializePaystackService,
} from "../services/paystackService.js";

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
          }
        );

      res.status(200).json(
        response
      );
    } catch (error) {
      console.log(
        error.response?.data ||
          error.message
      );

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };