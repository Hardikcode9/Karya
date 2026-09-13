const Product = require("../models/Product");
const SHGProfile = require("../models/SHGProfile");

// GET all products (public, with optional SHG filter)
exports.getProducts = async (req, res) => {
  try {
    const { shg, category, page = 1, limit = 20 } = req.query;
    const filter = { isActive: true };

    if (shg) filter.shg = shg;
    if (category) filter.category = { $regex: category, $options: "i" };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .populate("shg", "shgName village district state")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "shg",
      "shgName village district state rating"
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE product (SHG only)
exports.createProduct = async (req, res) => {
  try {
    const shg = await SHGProfile.findOne({ user: req.user.userId });
    if (!shg) {
      return res.status(404).json({ success: false, message: "SHG profile not found" });
    }

    const product = await Product.create({
      ...req.body,
      shg: shg._id,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE product (SHG only - own products)
exports.updateProduct = async (req, res) => {
  try {
    const shg = await SHGProfile.findOne({ user: req.user.userId });
    if (!shg) {
      return res.status(404).json({ success: false, message: "SHG profile not found" });
    }

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, shg: shg._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found or not owned by your SHG" });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE product (SHG only - own products)
exports.deleteProduct = async (req, res) => {
  try {
    const shg = await SHGProfile.findOne({ user: req.user.userId });
    if (!shg) {
      return res.status(404).json({ success: false, message: "SHG profile not found" });
    }

    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      shg: shg._id,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found or not owned by your SHG" });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
