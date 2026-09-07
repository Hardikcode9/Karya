const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const WorkerProfile = require("../models/WorkerProfile");

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

    // Validate status
    const allowedStatuses = ["paid", "failed", "refunded"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status",
      });
    }

    // Find payment
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

    // Strict payment state transitions
    if (payment.status === "pending") {
      // Cash payments must be confirmed by the worker
      if (payment.paymentMethod === "cash" && status === "paid") {
        return res.status(403).json({
          success: false,
          message: "Cash payments must be confirmed by the worker",
        });
      }

      if (status === "refunded") {
        return res.status(400).json({
          success: false,
          message: "Pending payment cannot be refunded",
        });
      }
    }

    if (payment.status === "paid") {
      if (status !== "refunded") {
        return res.status(400).json({
          success: false,
          message: "Paid payment can only be refunded",
        });
      }
    }

    if (payment.status === "failed") {
      return res.status(400).json({
        success: false,
        message: "Failed payment cannot be changed",
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

    // Generate simulated transaction ID only when payment becomes paid
    if (status === "paid" && !payment.transactionId) {
      payment.transactionId = `SIM-${Date.now()}-${Math.floor(
        Math.random() * 10000,
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

const confirmCashPayment = async (req, res) => {
  try {
    // Only workers can confirm cash payments
    if (req.user.role !== "worker") {
      return res.status(403).json({
        success: false,
        message: "Only workers can confirm cash payments",
      });
    }

    const { id } = req.params;

    // Find payment
    const payment = await Payment.findById(id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // Payment must be cash
    if (payment.paymentMethod !== "cash") {
      return res.status(400).json({
        success: false,
        message: "Only cash payments can be confirmed by worker",
      });
    }

    // Find worker profile of logged-in worker
    const workerProfile = await WorkerProfile.findOne({
      user: req.user.userId,
    });

    if (!workerProfile) {
      return res.status(404).json({
        success: false,
        message: "Worker profile not found",
      });
    }

    // Make sure this payment belongs to this worker
    if (payment.worker.toString() !== workerProfile._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot confirm this payment",
      });
    }

    // Payment must still be pending
    if (payment.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Payment cannot be confirmed because its status is ${payment.status}`,
      });
    }

    // Mark cash payment as paid
    payment.status = "paid";

    // Generate simulated transaction ID
    if (!payment.transactionId) {
      payment.transactionId = `CASH-${Date.now()}-${Math.floor(
        Math.random() * 10000,
      )}`;
    }

    await payment.save();

    return res.status(200).json({
      success: true,
      message: "Cash payment confirmed successfully",
      payment,
    });
  } catch (error) {
    console.error("Confirm cash payment error:", error);

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
  confirmCashPayment,
  getCustomerPayments,
  getPaymentById,
};
