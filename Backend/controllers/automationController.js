const mongoose = require("mongoose");
const User = require("../models/User");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const WorkerProfile = require("../models/WorkerProfile");
const AutomationLog = require("../models/AutomationLog");
const { deliverReceiptEmail } = require("../services/emailService");
const { initiateConfirmationCall } = require("../services/voiceCallService");

// In-memory fallback cache for development/offline mode
const memoryAutomationLogs = [];

/**
 * GET /api/automation/session
 * Reaches into backend session, retrieves currently logged-in user profile, email ID, and their latest order.
 */
const getActiveSessionDetails = async (req, res) => {
  try {
    let user = null;

    if (mongoose.connection.readyState === 1) {
      if (req.user && req.user.userId) {
        user = await User.findById(req.user.userId).select("-password");
      }

      if (!user) {
        user = await User.findOne({ role: "customer" }).select("-password");
      }
    }

    // Fallback user if not found in database or database is offline
    if (!user) {
      user = {
        _id: new mongoose.Types.ObjectId(),
        name: "Siddhant Sharma",
        email: "siddhant.customer@example.com",
        phone: "+91 98765 43210",
        role: "customer",
      };
    }

    // Find latest booking for this customer
    let latestBooking = null;
    if (mongoose.connection.readyState === 1) {
      try {
        latestBooking = await Booking.findOne({ customer: user._id })
          .populate("service", "name category price")
          .populate({
            path: "worker",
            populate: { path: "user", select: "name phone email" },
          })
          .sort({ createdAt: -1 });
      } catch (e) {
        console.warn("Could not query latest booking:", e.message);
      }
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      latestBooking: latestBooking || null,
      message: `Identified logged-in user: ${user.name} (${user.email})`,
    });
  } catch (error) {
    console.error("getActiveSessionDetails error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to inspect backend session",
    });
  }
};

/**
 * POST /api/automation/trigger
 * Executes the complete 4-step automation pipeline:
 * 1. Fetch authenticated user & email
 * 2. Generate itemized receipt + Thank You note
 * 3. Deliver email receipt via nodemailer
 * 4. Trigger automated confirmation call with provider arrival details
 */
const triggerOrderAutomation = async (req, res) => {
  try {
    // 1. REACH INTO BACKEND: Identify logged-in user & email
    let user = null;
    if (mongoose.connection.readyState === 1) {
      if (req.user && req.user.userId) {
        user = await User.findById(req.user.userId);
      }
      if (!user) {
        user = await User.findOne({ role: "customer" });
      }
    }

    const customerEmail =
      req.body.customerEmail ||
      (user ? user.email : "siddhant.customer@example.com");
    const customerName =
      req.body.customerName ||
      (user ? user.name : "Siddhant Sharma");
    const customerPhone =
      req.body.customerPhone ||
      (user ? user.phone : "+91 98765 43210");

    // 2. FETCH ORDER / BOOKING DETAILS
    const {
      orderId = `ORD-KRY-${Date.now().toString().slice(-6)}`,
      items = [
        {
          name: "Submersible Pump Wiring & Motor Overhaul",
          category: "Home Electrical Service",
          quantity: 1,
          price: 650,
        },
      ],
      amountPaid = 650,
      paymentMethod = "upi",
      transactionId = `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      isService = true,
      customArrivalDetails,
      callLanguage,
    } = req.body;

    // Build service provider arrival details
    const arrivalDetails = customArrivalDetails || {
      providerName: req.body.providerName || "Ramesh Kumar (Verified Electrician)",
      providerPhone: req.body.providerPhone || "+91 98234 56789",
      serviceName: items[0]?.name || "Rural Trade Service",
      arrivalWindow: req.body.arrivalWindow || "Today at 03:30 PM (within 45 mins)",
      address: req.body.address || "Ward #4, Near Panchayat Bhavan, Rampur",
    };

    // Generate unique receipt number
    const receiptNumber = `REC-KRY-${Date.now().toString().slice(-6)}`;

    // Craft heartfelt rural empowerment Thank You Note
    const thankYouNote =
      req.body.thankYouNote ||
      `Dear ${customerName}, thank you wholeheartedly for your booking! By choosing Karya, you are directly powering fair local wages and dignity for rural tradespeople and SHG craftspeople. Our team is at your service.`;

    // 3. STEP 2 & 3: DELIVER RECEIPT & THANK YOU NOTE VIA EMAIL
    const emailResult = await deliverReceiptEmail({
      customerEmail,
      customerName,
      receiptNumber,
      items,
      amountPaid,
      paymentMethod,
      transactionId,
      thankYouNote,
      arrivalDetails: isService ? arrivalDetails : null,
    });

    // 4. STEP 4: TRIGGER AUTOMATED CONFIRMATION CALL (AFTER THANK YOU NOTE IS DELIVERED)
    const callResult = await initiateConfirmationCall({
      customerPhone,
      customerName,
      items,
      amountPaid,
      isService,
      arrivalDetails,
      language: callLanguage,
    });

    // Record automation log in database (or fallback memory)
    const logData = {
      user: user ? user._id : null,
      customerEmail,
      customerName,
      customerPhone,
      orderId,
      orderType: isService ? "service" : "product",
      receiptNumber,
      amountPaid,
      paymentMethod,
      transactionId,
      items,
      thankYouNote,
      emailDelivery: {
        status: emailResult.status,
        messageId: emailResult.messageId,
        previewUrl: emailResult.previewUrl,
        deliveredAt: emailResult.deliveredAt,
        recipient: customerEmail,
      },
      voiceCall: {
        status: callResult.status,
        calledNumber: customerPhone,
        language: callResult.language,
        languageLabel: callResult.languageLabel,
        script: callResult.script,
        scripts: callResult.scripts,
        providerArrivalDetails: arrivalDetails,
        callTriggeredAt: callResult.triggeredAt,
      },
    };

    try {
      if (mongoose.connection.readyState === 1) {
        await AutomationLog.create(logData);
      } else {
        memoryAutomationLogs.unshift(logData);
      }
    } catch (dbErr) {
      console.warn("Could not save to AutomationLog model, stored in memory:", dbErr.message);
      memoryAutomationLogs.unshift(logData);
    }

    return res.status(200).json({
      success: true,
      message: "Order automation pipeline completed successfully",
      stepSummary: {
        userIdentified: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
        },
        receiptGenerated: {
          receiptNumber,
          amountPaid,
          itemsCount: items.length,
          thankYouNote,
        },
        emailDelivered: {
          status: emailResult.status,
          recipient: customerEmail,
          previewUrl: emailResult.previewUrl,
        },
        confirmationCallTriggered: {
          status: callResult.status,
          callId: callResult.callId,
          language: callResult.language,
          languageLabel: callResult.languageLabel,
          supportedLanguages: callResult.supportedLanguages,
          script: callResult.script,
          scripts: callResult.scripts,
          providerArrivalDetails: arrivalDetails,
        },
      },
      receipt: {
        receiptNumber,
        orderId,
        items,
        amountPaid,
        paymentMethod,
        transactionId,
        thankYouNote,
        date: new Date().toISOString(),
      },
      emailDelivery: emailResult,
      voiceCall: callResult,
    });
  } catch (error) {
    console.error("triggerOrderAutomation error:", error);
    return res.status(500).json({
      success: false,
      message: "Automation workflow failed",
      error: error.message,
    });
  }
};

/**
 * GET /api/automation/history
 * Fetches recent automation logs for the user
 */
const getAutomationHistory = async (req, res) => {
  try {
    let logs = [];
    if (mongoose.connection.readyState === 1) {
      logs = await AutomationLog.find().sort({ createdAt: -1 }).limit(10);
    } else {
      logs = memoryAutomationLogs.slice(0, 10);
    }

    return res.status(200).json({
      success: true,
      count: logs.length,
      logs,
    });
  } catch (error) {
    console.error("getAutomationHistory error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch automation history",
    });
  }
};

module.exports = {
  getActiveSessionDetails,
  triggerOrderAutomation,
  getAutomationHistory,
};
