import express from "express";

import {
  createPaypalOrder,
  capturePaypalPayment,
  cancelPaypalOrder,
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

/* ========================================
   CANCEL ORDER
======================================== */

router.post(
  "/cancel",
  cancelPaypalOrder
);

export default router;