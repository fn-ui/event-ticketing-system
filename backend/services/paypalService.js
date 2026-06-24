import paypalClient from "../config/paypal.js";

import paypal from "@paypal/checkout-server-sdk";

export const createPaypalOrderService =
  async ({ amount }) => {
    try {

      console.log(
        "======================"
      );

      console.log(
        "PAYPAL AMOUNT:",
        amount
      );

      console.log(
        "TYPE OF AMOUNT:",
        typeof amount
      );

      console.log(
        "NUMBER VALUE:",
        Number(amount)
      );

      console.log(
        "======================"
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
              "Event Ticketing System",

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

      const response =
        await paypalClient.execute(
          request
        );

      const approvalUrl =
        response.result.links.find(
          (link) =>
            link.rel ===
            "approve"
        )?.href;

      return {
        success: true,

        orderID:
          response.result.id,

        approval_url:
          approvalUrl,
      };
    } catch (error) {
      console.error(
        "PayPal Service Error:",
        error
      );

      throw error;
    }
  };