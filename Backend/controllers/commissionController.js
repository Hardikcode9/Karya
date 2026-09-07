const Commission = require("../models/Commission");
const Payment = require("../models/Payment");

const COMMISSION_RATE = 10;

const createCommission = async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Only customers can create commission records",
      });
    }

    const { paymentId } = req.body;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: "Payment ID is required",
      });
    }

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    if (payment.customer.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot create commission for this payment",
      });
    }

    if (payment.status !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Commission can only be created for paid payments",
      });
    }

    const existingCommission = await Commission.findOne({
      payment: payment._id,
    });

    if (existingCommission) {
      return res.status(409).json({
        success: false,
        message: "Commission already exists for this payment",
        commission: existingCommission,
      });
    }

    const grossAmount = payment.amount;
    const commissionAmount = (grossAmount * COMMISSION_RATE) / 100;
    const workerEarning = grossAmount - commissionAmount;

    const commission = await Commission.create({
      booking: payment.booking,
      payment: payment._id,
      worker: payment.worker,
      grossAmount,
      commissionRate: COMMISSION_RATE,
      commissionAmount,
      workerEarning,
    });

    return res.status(201).json({
      success: true,
      message: "Commission created successfully",
      commission,
    });
  } catch (error) {
    console.error("Create commission error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createCommission,
};