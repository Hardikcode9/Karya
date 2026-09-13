const mongoose = require("mongoose");

const querySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: ["booking", "payment", "service", "account", "other"],
      default: "other",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },

    status: {
      type: String,
      enum: ["open", "in-progress", "resolved", "closed"],
      default: "open",
    },

    response: {
      type: String,
      trim: true,
    },

    respondedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

querySchema.index({ user: 1, createdAt: -1 });
querySchema.index({ status: 1 });

module.exports = mongoose.model("Query", querySchema);
