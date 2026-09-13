const Suggestion = require("../models/Suggestion");

// Submit suggestion (authenticated user)
exports.createSuggestion = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    const suggestion = await Suggestion.create({
      user: req.user.userId,
      title,
      description,
      category,
    });

    res.status(201).json({
      success: true,
      message: "Suggestion submitted successfully",
      data: suggestion,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get suggestions (admin gets all, user gets own)
exports.getSuggestions = async (req, res) => {
  try {
    const { status, category, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (req.user.role !== "admin") {
      filter.user = req.user.userId;
    }

    if (status) filter.status = status;
    if (category) filter.category = category;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Suggestion.countDocuments(filter);

    const suggestions = await Suggestion.find(filter)
      .populate("user", "name email phone role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: suggestions.length,
      total,
      data: suggestions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update suggestion (admin)
exports.updateSuggestion = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    const suggestion = await Suggestion.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true, runValidators: true }
    ).populate("user", "name email phone role");

    if (!suggestion) {
      return res.status(404).json({ success: false, message: "Suggestion not found" });
    }

    res.status(200).json({
      success: true,
      message: "Suggestion updated successfully",
      data: suggestion,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
