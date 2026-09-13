const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    shg: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SHGProfile",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    sku: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    unit: {
      type: String,
      default: "piece",
      trim: true,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    images: {
      type: [String],
      default: [],
    },

    artisanLead: {
      type: String,
      trim: true,
    },

    certifications: {
      type: [String],
      default: [],
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

productSchema.index({ shg: 1 });
productSchema.index({ category: 1 });

module.exports = mongoose.model("Product", productSchema);
