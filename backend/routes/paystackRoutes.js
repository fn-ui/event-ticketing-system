import express from "express";

import {
  testPaystack,
  initializePaystack,
  verifyPaystackPayment,
} from "../controllers/paystackController.js";

const router =
  express.Router();

/* ========================================
   TEST ROUTE
======================================== */

router.get(
  "/test",
  testPaystack
);

/* ========================================
   INITIALIZE PAYMENT
======================================== */

router.post(
  "/initialize",
  initializePaystack
);

/* ========================================
   VERIFY PAYMENT
======================================== */

router.get(
  "/verify/:reference",
  verifyPaystackPayment
);

export default router;
