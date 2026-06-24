import axios from "axios";

/* ========================================
   GENERATE ACCESS TOKEN
======================================== */

export const generateDarajaToken =
  async () => {
    try {
      const consumerKey =
        process.env
          .DARAJA_CONSUMER_KEY;

      const consumerSecret =
        process.env
          .DARAJA_CONSUMER_SECRET;

     

      const auth =
        Buffer.from(
          `${consumerKey}:${consumerSecret}`
        ).toString("base64");

      const response =
        await axios.get(
          "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
          {
            headers: {
              Authorization: `Basic ${auth}`,
            },
          }
        );

      console.log(
        "TOKEN SUCCESS:",
        response.data
      );

      return response.data
        .access_token;
    } catch (error) {
      console.log(
        "TOKEN ERROR:"
      );

      console.log(
        error.response?.data ||
          error.message
      );

      throw error;
    }
  };

/* ========================================
   STK PUSH
======================================== */

export const stkPushService =
  async ({
    phone,
    amount,
  }) => {
    try {
      console.log(
        "STK PUSH START"
      );

      console.log(
        "Phone:",
        phone
      );

      console.log(
        "Amount:",
        amount
      );

      const shortcode =
        process.env
          .DARAJA_SHORTCODE;

      const passkey =
        process.env
          .DARAJA_PASSKEY;

      const token =
        await generateDarajaToken();

      /* FORMAT PHONE */
      const formattedPhone =
        phone.startsWith("0")
          ? phone.replace(
              /^0/,
              "254"
            )
          : phone;

      /* GENERATE TIMESTAMP */
      const timestamp =
        new Date()
          .toISOString()
          .replace(
            /[^0-9]/g,
            ""
          )
          .slice(0, 14);

      /* GENERATE PASSWORD */
      const password =
        Buffer.from(
          `${shortcode}${passkey}${timestamp}`
        ).toString("base64");

     

      const response =
        await axios.post(
          "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
          {
            BusinessShortCode:
              "174379",

            Password:
              password,

            Timestamp:
              timestamp,

            TransactionType:
              "CustomerPayBillOnline",

            Amount:
              amount,

            PartyA:
              formattedPhone,

            PartyB:
              "174379",

            PhoneNumber:
              formattedPhone,
 
            CallBackURL:
          "https://event-ticketing-system-cror.onrender.com/api/daraja/callback",
            AccountReference:
              "EventPay",

            TransactionDesc:
              "Event Payment",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      console.log(
        "STK RESPONSE:"
      );

      console.log(
        response.data
      );

      return response.data;
    } catch (error) {
      console.log(
        "FULL DARAJA ERROR:"
      );

      console.log(
        error.response?.data ||
          error.message
      );

      throw error;
    }
  };