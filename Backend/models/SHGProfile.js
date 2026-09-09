const mongoose = require("mongoose");

const shgMemberSchema = new mongoose.Schema(
  {
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
  { _id: false }
);

const shgProfileSchema = new mongoose.Schema(
  {
    // SHG coordinator/login user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    shgName: {
      type: String,
      required: true,
      trim: true,
    },

    registrationId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    village: {
      type: String,
      required: true,
      trim: true,
    },

    district: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    contactNumber: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    establishedDate: {
      type: Date,
    },

    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },

    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
    ],

    members: [shgMemberSchema],

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
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

module.exports = mongoose.model("SHGProfile", shgProfileSchema);