const mongoose = require("mongoose");

const automationLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    customerName: {
      type: String,
      default: "Valued Customer",
    },
    customerPhone: {
      type: String,
      default: "+91 98765 43210",
    },
    orderId: {
      type: String,
      required: true,
    },
    orderType: {
      type: String,
      enum: ["service", "product", "cart_checkout"],
      default: "service",
    },
    receiptNumber: {
      type: String,
      required: true,
      unique: true,
    },
    amountPaid: {
      type: Number,
      required: true,
      default: 0,
    },
    paymentMethod: {
      type: String,
      default: "online",
    },
    transactionId: {
      type: String,
      default: "",
    },
    items: [
      {
        name: { type: String, required: true },
        category: { type: String, default: "Service" },
        quantity: { type: Number, default: 1 },
        price: { type: Number, required: true },
      },
    ],
    thankYouNote: {
      type: String,
      required: true,
    },
    emailDelivery: {
      status: {
        type: String,
        enum: ["sent", "simulated", "failed"],
        default: "sent",
      },
      messageId: { type: String, default: "" },
      previewUrl: { type: String, default: "" },
      deliveredAt: { type: Date, default: Date.now },
      recipient: { type: String, default: "" },
    },
    voiceCall: {
      status: {
        type: String,
        enum: ["queued", "ringing", "answered", "completed", "failed"],
        default: "queued",
      },
      calledNumber: { type: String, default: "" },
      language: { type: String, default: "en" },
      languageLabel: { type: String, default: "" },
      script: { type: String, default: "" },
      // All generated language variants of the script, keyed by language code
      // ("en", "hi", "bn", "mr", "mai") so replays can switch language.
      scripts: {
        type: Map,
        of: String,
        default: undefined,
      },
      providerArrivalDetails: {
        providerName: { type: String, default: "" },
        providerPhone: { type: String, default: "" },
        serviceName: { type: String, default: "" },
        arrivalWindow: { type: String, default: "" },
        address: { type: String, default: "" },
      },
      callTriggeredAt: { type: Date, default: Date.now },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AutomationLog", automationLogSchema);
