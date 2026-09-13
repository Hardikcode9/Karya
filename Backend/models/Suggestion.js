const mongoose = require("mongoose");

const suggestionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: ["feature", "improvement", "bug", "service", "other"],
      default: "other",
    },

    status: {
      type: String,
      enum: ["pending", "reviewed", "accepted", "implemented", "declined"],
      default: "pending",
    },

    adminNotes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

suggestionSchema.index({ user: 1, createdAt: -1 });
suggestionSchema.index({ status: 1 });

module.exports = mongoose.model("Suggestion", suggestionSchema);
