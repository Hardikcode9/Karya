const mongoose = require("mongoose");

const customerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    // Mirroring essential fields for ease of access in frontend, 
    // populated from User during seeding/registration.
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
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
    address: {
      type: String,
    },
    preferences: {
      type: [String],
      default: [],
    },
    loyaltyPoints: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

customerProfileSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("CustomerProfile", customerProfileSchema);
