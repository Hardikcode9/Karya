const express = require("express");

const {
  createBooking,
  getWorkerBookings,
  updateBookingStatus,
  getCustomerBookings,
  cancelBooking,
} = require("../controllers/bookingController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Customer creates booking
router.post("/", authMiddleware, createBooking);

// Worker views their bookings
router.get("/worker", authMiddleware, getWorkerBookings);

// Customer views their bookings
router.get("/customer", authMiddleware, getCustomerBookings);

// Customer cancels their own booking
router.patch("/:id/cancel", authMiddleware, cancelBooking);

// Worker updates booking status
router.patch("/:id/status", authMiddleware, updateBookingStatus);

module.exports = router;