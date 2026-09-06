const Payment = require("../models/Payment");
const Booking = require("../models/Booking");

const createPayment = async (req, res) => {
  try {
    // Only customers can make payments
    if (req.user.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Only customers can make payments",
      });
    }

    const { bookingId, paymentMethod } = req.body;

    // Validate input
    if (!bookingId || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "bookingId and paymentMethod are required",
      });
    }

    // Validate payment method
    const allowedMethods = ["upi", "cash", "card"];

    if (!allowedMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    // Find booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Make sure booking belongs to logged-in customer
    if (booking.customer.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot pay for this booking",
      });
    }

    // Payment is allowed only after service is completed
    if (booking.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Payment is allowed only for completed bookings",
      });
    }

    // Prevent duplicate payment
    const existingPayment = await Payment.findOne({
      booking: booking._id,
    });

    if (existingPayment) {
      return res.status(409).json({
        success: false,
        message: "Payment already exists for this booking",
        payment: existingPayment,
      });
    }

    // Create payment using server-side booking information
    const payment = await Payment.create({
      booking: booking._id,
      customer: booking.customer,
      worker: booking.worker,
      amount: booking.price,
      paymentMethod,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Payment created successfully",
      payment,
    });
  } catch (error) {
    console.error("Create payment error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Only customers can update their payment
    if (req.user.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Only customers can update payment status",
      });
    }

    const allowedStatuses = ["paid", "failed", "refunded"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status",
      });
    }

    const payment = await Payment.findById(id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // Make sure payment belongs to logged-in customer
    if (payment.customer.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot update this payment",
      });
    }

    // Prevent changing a final payment incorrectly
    if (payment.status === "paid" && status !== "refunded") {
      return res.status(400).json({
        success: false,
        message: "Paid payment can only be refunded",
      });
    }

    if (payment.status === "refunded") {
      return res.status(400).json({
        success: false,
        message: "Refunded payment cannot be changed",
      });
    }

    // Update status
    payment.status = status;

    // Generate simulated transaction ID when payment is completed
    if (status === "paid" && !payment.transactionId) {
      payment.transactionId = `SIM-${Date.now()}-${Math.floor(
        Math.random() * 10000
      )}`;
    }

    await payment.save();

    return res.status(200).json({
      success: true,
      message: `Payment marked as ${status}`,
      payment,
    });
  } catch (error) {
    console.error("Update payment status error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getCustomerPayments = async (req, res) => {
  try {
    // Only customers can view customer payment history
    if (req.user.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Only customers can view payment history",
      });
    }

    const payments = await Payment.find({
      customer: req.user.userId,
    })
      .populate({
        path: "booking",
        populate: [
          {
            path: "worker",
            populate: {
              path: "user",
              select: "name phone",
            },
          },
          {
            path: "service",
            select: "name category",
          },
        ],
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error("Get customer payments error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getPaymentById = async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Only customers can view payment details",
      });
    }

    const { id } = req.params;

    const payment = await Payment.findById(id)
      .populate("customer", "name email phone")
      .populate({
        path: "worker",
        populate: {
          path: "user",
          select: "name phone",
        },
      })
      .populate({
        path: "booking",
        populate: {
          path: "service",
          select: "name category",
        },
      });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // Security check
    if (payment.customer._id.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot access this payment",
      });
    }

    return res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error("Get payment error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createPayment,
  updatePaymentStatus,
  getCustomerPayments,
  getPaymentById,
};