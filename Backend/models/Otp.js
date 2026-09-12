const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  otp: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["customer", "worker", "shg", "admin"],
    default: "customer",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // Document will automatically be removed by MongoDB after 5 minutes (300 seconds)
  },
});

module.exports = mongoose.model("Otp", otpSchema);
