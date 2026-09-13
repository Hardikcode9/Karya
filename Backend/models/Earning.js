const mongoose = require("mongoose");

const earningSchema = new mongoose.Schema(
  {
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkerProfile",
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true, // Only one earning record per booking
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMode: {
      type: String,
      default: "cash",
    },
    status: {
      type: String,
      enum: ["pending", "cleared", "paid"],
      default: "cleared",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Earning", earningSchema);
