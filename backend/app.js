import express from "express";

import cors from "cors";

import darajaRoutes from "./routes/darajaRoutes.js";

import paypalRoutes from "./routes/paypalRoutes.js";

import paystackRoutes from "./routes/paystackRoutes.js";
import darajaCallbackRoute
  from "./routes/darajaCallbackRoute.js";

const app = express();

app.use(cors());

app.use(express.json());

/* HEALTH CHECK */
app.get("/", (req, res) => {
  res.json({
    message:
      "Event Ticketing Backend Running",
  });
});

/* ROUTES */
app.use(
  "/api/daraja",
  darajaRoutes
);

app.use(
  "/api/paypal",
  paypalRoutes
);

app.use(
  "/api/paystack",
  paystackRoutes
);

app.use(
  "/api/daraja",
  darajaCallbackRoute
);

export default app;