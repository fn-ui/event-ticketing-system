import express from "express";

const router =
  express.Router();

/* ========================================
   DARAJA CALLBACK
======================================== */

router.post(
  "/callback",
  async (req, res) => {
    try {
      console.log(
        "DARAJA CALLBACK:"
      );

      console.log(
        JSON.stringify(
          req.body,
          null,
          2
        )
      );

      return res.status(200).json({
        ResultCode: 0,

        ResultDesc:
          "Accepted",
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
      });
    }
  }
);

export default router;