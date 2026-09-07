const Invoice = require("../models/Invoice");
const Payment = require("../models/Payment");
const Commission = require("../models/Commission");
const Booking = require("../models/Booking");

const createInvoice = async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Only customers can create invoices",
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
        message: "You cannot create an invoice for this payment",
      });
    }

    if (payment.status !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Invoice can only be created for paid payments",
      });
    }

    const commission = await Commission.findOne({
      payment: payment._id,
    });

    if (!commission) {
      return res.status(400).json({
        success: false,
        message: "Commission must be created before invoice",
      });
    }

    const existingInvoice = await Invoice.findOne({
      payment: payment._id,
    });

    if (existingInvoice) {
      return res.status(409).json({
        success: false,
        message: "Invoice already exists for this payment",
        invoice: existingInvoice,
      });
    }

    const booking = await Booking.findById(payment.booking);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const invoiceNumber = `INV-${Date.now()}`;

    const invoice = await Invoice.create({
      invoiceNumber,
      booking: payment.booking,
      payment: payment._id,
      customer: payment.customer,
      worker: payment.worker,
      service: booking.service,
      amount: payment.amount,
      commissionAmount: commission.commissionAmount,
      workerEarning: commission.workerEarning,
      paymentMethod: payment.paymentMethod,
      transactionId: payment.transactionId,
      status: "paid",
    });

    return res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      invoice,
    });
  } catch (error) {
    console.error("Create invoice error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getCustomerInvoice = async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Only customers can view invoices",
      });
    }

    const { id } = req.params;

    const invoice = await Invoice.findById(id)
      .populate("booking")
      .populate("customer", "name email")
      .populate({
        path: "worker",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .populate("service");

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    if (invoice.customer._id.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot view this invoice",
      });
    }

    return res.status(200).json({
      success: true,
      invoice,
    });
  } catch (error) {
    console.error("Get customer invoice error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createInvoice,
  getCustomerInvoice,
};