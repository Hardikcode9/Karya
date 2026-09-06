const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  createPayment,
  updatePaymentStatus,
  getCustomerPayments,
} = require("../controllers/paymentController");

router.post("/", authMiddleware, createPayment);
router.get("/customer", authMiddleware, getCustomerPayments);
router.put("/:id", authMiddleware, updatePaymentStatus);
router.patch("/:id/status", authMiddleware, updatePaymentStatus);

module.exports = router;
