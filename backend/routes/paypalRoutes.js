import express from "express";

import {
  createPaypalOrder,
  capturePaypalPayment,
} from "../controllers/paypalController.js";

const router =
  express.Router();

/* ========================================
   CREATE ORDER
======================================== */

router.post(
  "/create-order",
  createPaypalOrder
);

/* ========================================
   CAPTURE PAYMENT
======================================== */

router.post(
  "/capture",
  capturePaypalPayment
);

export default router;