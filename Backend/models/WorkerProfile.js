const mongoose = require("mongoose");

const workerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    bio: {
      type: String,
      trim: true,
    },

    experience: {
      type: Number,
      default: 0,
    },

    skills: {
      type: [String],
      default: [],
    },

    pricePerService: {
      type: Number,
      required: true,
      min: 0,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

workerProfileSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("WorkerProfile", workerProfileSchema);
