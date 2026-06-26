import axios from "axios";

/* ========================================
   INITIALIZE TRANSACTION
======================================== */

export const initializePaystackService =
  async ({
    email,
    amount,
    callback_url,
    metadata,
  }) => {
    try {
      const response =
        await axios.post(
          "https://api.paystack.co/transaction/initialize",
          {
            email,

            amount:
              amount * 100,

            callback_url,

            metadata,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,

              "Content-Type":
                "application/json",
            },
          }
        );

      return response.data;
    } catch (error) {
      console.log(
        error.response?.data ||
          error.message
      );

      throw error;
    }
  };

/* ========================================
   VERIFY TRANSACTION
======================================== */

export const verifyPaystackService =
  async (
    reference
  ) => {
    try {
      const response =
        await axios.get(
          `https://api.paystack.co/transaction/verify/${encodeURIComponent(
            reference
          )}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
          }
        );

      return response.data;
    } catch (error) {
      console.log(
        error.response?.data ||
          error.message
      );

      throw error;
    }
  };
