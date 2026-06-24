import paypal from "@paypal/checkout-server-sdk";

import paypalClient from "../config/paypal.js";

/* ========================================
   CREATE PAYPAL ORDER
======================================== */

export const createPaypalOrder =
  async (
    req,
    res
  ) => {
    try {

      const { amount } =
        req.body;

      console.log(
        "PAYPAL AMOUNT:",
        amount
      );

      const request =
        new paypal.orders.OrdersCreateRequest();

      request.prefer(
        "return=representation"
      );

      request.requestBody({
        intent: "CAPTURE",

        purchase_units: [
          {
            amount: {
              currency_code:
                "USD",

              value:
                Number(
                  amount
                ).toFixed(2),
            },
          },
        ],

        application_context:
          {
            brand_name:
              "EventPay",

            landing_page:
              "LOGIN",

            user_action:
              "PAY_NOW",

            return_url:
              "http://localhost:5173/paypal-success",

            cancel_url:
              "http://localhost:5173/paypal-cancel",
          },
      });

      const order =
        await paypalClient.execute(
          request
        );

      const approvalUrl =
        order.result.links.find(
          (link) =>
            link.rel ===
            "approve"
        )?.href;

      res.status(200).json({
        success: true,

        orderID:
          order.result.id,

        approval_url:
          approvalUrl,
      });
    } catch (error) {

      console.error(
        "PAYPAL CREATE ORDER ERROR:",
        error
      );

      res.status(500).json({
        success: false,

        message:
          "Failed to create PayPal order",
      });
    }
  };

/* ========================================
   CAPTURE PAYPAL PAYMENT
======================================== */

export const capturePaypalPayment =
  async (
    req,
    res
  ) => {
    try {

      const { orderID } =
        req.body;

      const request =
        new paypal.orders.OrdersCaptureRequest(
          orderID
        );

      request.requestBody({});

      const capture =
        await paypalClient.execute(
          request
        );

      res.status(200).json({
        success: true,

        data:
          capture.result,
      });
    } catch (error) {

      console.error(
        "PAYPAL CAPTURE ERROR:",
        error
      );

      res.status(500).json({
        success: false,

        message:
          "Failed to capture PayPal payment",
      });
    }
  };