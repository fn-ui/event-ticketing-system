import {
  stkPushService,
} from "../services/darajaService.js";

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

export const initiateSTKPush =
  async (req, res) => {
    try {
      const {
        phone,
        amount,
      } = req.body;

      console.log(
        "DARAAJA REQUEST:",
        req.body
      );

      const response =
        await stkPushService({
          phone,
          amount,
        });

      console.log(
        "DARAAJA SUCCESS:",
        response
      );

      res.status(200).json({
        success: true,
        message:
          "STK Push initiated",
        data: response,
      });
    } catch (error) {
      console.log(
        "DARAAJA CONTROLLER ERROR:"
      );

      console.log(
        error.response?.data ||
          error.message
      );

      res.status(500).json({
        success: false,
        message:
          error.response?.data
            ?.errorMessage ||
          error.message,
      });
    }
  };