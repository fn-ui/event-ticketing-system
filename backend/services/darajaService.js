import axios from "axios";

/* ========================================
   GENERATE ACCESS TOKEN

   Daraja tokens are valid for ~1 hour.
   Calling this on every STK push / query
   (as before) burns through Safaricom's
   sandbox rate limit for no reason - cache
   it and only refresh once it's close to
   expiring.
======================================== */

let cachedToken = null;

let cachedTokenExpiresAt = 0;

export const generateDarajaToken =
  async () => {
    if (
      cachedToken &&
      Date.now() <
        cachedTokenExpiresAt
    ) {
      return cachedToken;
    }

    try {
      const consumerKey =
        process.env
          .DARAJA_CONSUMER_KEY;

      const consumerSecret =
        process.env
          .DARAJA_CONSUMER_SECRET;

      /* ========================================
         GENERATE AUTH STRING
      ======================================== */

      const auth =
        Buffer.from(
          `${consumerKey}:${consumerSecret}`
        ).toString("base64");

      /* ========================================
         REQUEST TOKEN
      ======================================== */

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
        "TOKEN GENERATED SUCCESSFULLY"
      );

      cachedToken =
        response.data
          .access_token;

      const expiresInSeconds =
        Number(
          response.data
            .expires_in
        ) || 3600;

      /* refresh 2 minutes before actual expiry */
      cachedTokenExpiresAt =
        Date.now() +
        (expiresInSeconds - 120) *
          1000;

      return cachedToken;
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
   STK PUSH SERVICE
======================================== */

export const stkPushService =
  async ({
    phone,
    amount,
  }) => {
    try {
      console.log(
        "========== STK PUSH START =========="
      );

      console.log(
        "PHONE:",
        phone
      );

      console.log(
        "AMOUNT:",
        amount
      );

      /* ========================================
         ENV VARIABLES
      ======================================== */

      const shortcode =
        process.env
          .DARAJA_SHORTCODE;

      const passkey =
        process.env
          .DARAJA_PASSKEY;

      /* ========================================
         ACCESS TOKEN
      ======================================== */

      const token =
        await generateDarajaToken();

      /* ========================================
         FORMAT PHONE
      ======================================== */

      let formattedPhone =
        phone.trim();

      if (
        formattedPhone.startsWith(
          "0"
        )
      ) {
        formattedPhone =
          formattedPhone.replace(
            /^0/,
            "254"
          );
      }

      if (
        formattedPhone.startsWith(
          "+"
        )
      ) {
        formattedPhone =
          formattedPhone.substring(
            1
          );
      }

      console.log(
        "FORMATTED PHONE:",
        formattedPhone
      );

      /* ========================================
         GENERATE TIMESTAMP
      ======================================== */

      const timestamp =
        new Date()
          .toISOString()
          .replace(
            /[^0-9]/g,
            ""
          )
          .slice(0, 14);

      /* ========================================
         GENERATE PASSWORD
      ======================================== */

      const password =
        Buffer.from(
          `${shortcode}${passkey}${timestamp}`
        ).toString("base64");

      /* ========================================
         STK PUSH REQUEST
      ======================================== */

      const response =
        await axios.post(
          "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
          {
            BusinessShortCode:
              shortcode,

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
              shortcode,

            PhoneNumber:
              formattedPhone,

            CallBackURL:
              process.env
                .DARAJA_CALLBACK_URL ||
              "https://event-ticketing-system-cror.onrender.com/api/daraja/callback",

            AccountReference:
              "EventPay",

            TransactionDesc:
              "Event Ticket Payment",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,

              "Content-Type":
                "application/json",
            },
          }
        );

      console.log(
        "========== STK RESPONSE =========="
      );

      console.log(
        response.data
      );

      return response.data;
    } catch (error) {
      console.log(
        "========== STK PUSH ERROR =========="
      );

      console.log(
        error.response?.data ||
          error.message
      );

      throw error;
    }
  };

/* ========================================
   STK PUSH QUERY SERVICE

   Daraja's callback (especially on the
   sandbox host) can be delayed or never
   arrive. This actively asks Safaricom for
   the real status of a CheckoutRequestID
   instead of only waiting on the callback.
======================================== */

export const stkPushQueryService =
  async (checkoutRequestID) => {
    const shortcode =
      process.env
        .DARAJA_SHORTCODE;

    const passkey =
      process.env
        .DARAJA_PASSKEY;

    const token =
      await generateDarajaToken();

    const timestamp =
      new Date()
        .toISOString()
        .replace(
          /[^0-9]/g,
          ""
        )
        .slice(0, 14);

    const password =
      Buffer.from(
        `${shortcode}${passkey}${timestamp}`
      ).toString("base64");

    const response =
      await axios.post(
        "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query",
        {
          BusinessShortCode:
            shortcode,

          Password:
            password,

          Timestamp:
            timestamp,

          CheckoutRequestID:
            checkoutRequestID,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,

            "Content-Type":
              "application/json",
          },
        }
      );

    return response.data;
  };