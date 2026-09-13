const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["customer", "worker", "shg", "admin"],
      default: "customer",
    },
    location: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    // Extended profile fields
    altPhone: { type: String, trim: true },
    photo: { type: String },
    houseNo: { type: String, trim: true },
    village: { type: String, trim: true },
    block: { type: String, trim: true },
    district: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },
    landmark: { type: String, trim: true },
    docType: { type: String, trim: true },
    docNumber: { type: String, trim: true },
    language: { type: String, default: "Hindi" },
    smsUpdates: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("User", userSchema);