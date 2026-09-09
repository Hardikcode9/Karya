const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

  worker: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "WorkerProfile",
},

shg: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "SHGProfile",
},

providerType: {
  type: String,
  enum: ["worker", "shg"],
  default: "worker",
},

assignedWorkers: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WorkerProfile",
  },
],

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    scheduledDate: {
      type: Date,
      required: true,
    },

    duration: {
      type: Number,
      required: true,
      min: 15,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "in_progress",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);

