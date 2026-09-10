const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createPayment,
  updatePaymentStatus,
  confirmCashPayment,
  getCustomerPayments,
  createRazorpayOrder,
  verifyPayment,
} = require("../controllers/paymentController");

// Create Razorpay Order
router.post("/create-order", authMiddleware, createRazorpayOrder);

// Verify Razorpay Payment Signature
router.post("/verify", authMiddleware, verifyPayment);

// Legacy/direct payment creation
router.post("/", authMiddleware, createPayment);

// Customer payment history
router.get("/customer", authMiddleware, getCustomerPayments);

// Update payment status
router.patch("/:id/status", authMiddleware, updatePaymentStatus);

// Worker confirms cash payment
router.patch("/:id/confirm-cash", authMiddleware, confirmCashPayment);

module.exports = router;