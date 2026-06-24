import axios from "axios";

export const initializePaystackService =
  async ({
    email,
    amount,
    callback_url,
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