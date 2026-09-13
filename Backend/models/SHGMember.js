const mongoose = require("mongoose");

const shgMemberSchema = new mongoose.Schema(
  {
    shg: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SHGProfile",
      required: true,
    },
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkerProfile",
      required: true,
    },
    memberRole: {
      type: String,
      enum: ["member", "leader", "coordinator"],
      default: "member",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure a worker is only part of an SHG once
shgMemberSchema.index({ shg: 1, worker: 1 }, { unique: true });

module.exports = mongoose.model("SHGMember", shgMemberSchema);
