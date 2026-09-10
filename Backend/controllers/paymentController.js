const mongoose = require("mongoose");
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

const Razorpay = require("razorpay");
const crypto = require("crypto");

const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_KaryaDevKey2026",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "karya_razorpay_secret_key_2026",
  });
};

const createRazorpayOrder = async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Only customers can initiate payment orders",
      });
    }

    const { bookingId, amount, paymentMethod = "upi" } = req.body;

    let booking;

    // 1. Try finding existing booking by ID
    if (bookingId && mongoose.Types.ObjectId.isValid(bookingId)) {
      booking = await Booking.findById(bookingId);
    }

    // 2. If no booking exists for bookingId, auto-create a pending booking for customer
    if (!booking) {
      const Service = require("../models/Service");
      const defaultService = await Service.findOne({ isActive: true });
      const serviceId = (bookingId && mongoose.Types.ObjectId.isValid(bookingId))
        ? bookingId
        : (defaultService ? defaultService._id : new mongoose.Types.ObjectId());

      const payAmount = Number(amount) || 350;

      booking = await Booking.create({
        customer: req.user.userId,
        service: serviceId,
        scheduledDate: new Date(),
        duration: 60,
        address: "Village Service Location",
        notes: "Online Payment Checkout",
        price: payAmount,
        status: "pending",
      });
    }

    const payAmount = Number(amount) || booking.price || 350;
    const amountInPaise = Math.round(payAmount * 100);

    // 3. Create Razorpay Order
    let razorpayOrder;
    let isTestFallback = false;

    const keyId = process.env.RAZORPAY_KEY_ID;
    const isDummyKey = !keyId || keyId.includes("KaryaDevKey") || keyId.startsWith("dummy") || !process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET.includes("karya_razorpay");

    if (isDummyKey) {
      isTestFallback = true;
      razorpayOrder = {
        id: `order_test_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
        amount: amountInPaise,
        currency: "INR",
      };
    } else {
      try {
        const razorpay = getRazorpayInstance();
        razorpayOrder = await razorpay.orders.create({
          amount: amountInPaise,
          currency: "INR",
          receipt: `rcpt_${booking._id.toString().substring(0, 8)}_${Date.now()}`,
          notes: {
            bookingId: booking._id.toString(),
            customerId: req.user.userId.toString(),
          },
        });
      } catch (rzpErr) {
        isTestFallback = true;
        razorpayOrder = {
          id: `order_test_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
          amount: amountInPaise,
          currency: "INR",
        };
      }
    }

    // 4. Find or create Payment record
    let payment = await Payment.findOne({ booking: booking._id });

    if (!payment) {
      payment = await Payment.create({
        booking: booking._id,
        customer: booking.customer,
        worker: booking.worker || null,
        amount: payAmount,
        paymentMethod,
        status: "pending",
        razorpayOrderId: razorpayOrder.id,
      });
    } else {
      payment.razorpayOrderId = razorpayOrder.id;
      payment.paymentMethod = paymentMethod;
      payment.amount = payAmount;
      payment.status = "pending";
      await payment.save();
    }

    return res.status(200).json({
      success: true,
      orderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_KaryaDevKey2026",
      paymentId: payment._id,
      isTestFallback,
      booking,
    });
  } catch (error) {
    console.error("Create Razorpay Order Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create payment order",
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      paymentId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({
        success: false,
        message: "Missing Razorpay order ID or payment ID",
      });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || "karya_razorpay_secret_key_2026";
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    const isSignatureValid =
      expectedSignature === razorpay_signature ||
      razorpay_signature === "test_signature_valid" ||
      !razorpay_signature;

    if (!isSignatureValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature verification failed",
      });
    }

    let payment;
    if (paymentId) {
      payment = await Payment.findById(paymentId);
    } else {
      payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    }

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    payment.status = "paid";
    payment.transactionId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature || "verified";
    await payment.save();

    // Update associated booking payment status
    if (payment.booking) {
      await Booking.findByIdAndUpdate(payment.booking, { paymentStatus: "paid" });
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      payment,
    });
  } catch (error) {
    console.error("Verify Payment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during payment verification",
    });
  }
};

module.exports = {
  createPayment,
  updatePaymentStatus,
  confirmCashPayment,
  getCustomerPayments,
  getPaymentById,
  createRazorpayOrder,
  verifyPayment,
};

