const Query = require("../models/Query");

// Submit a query (authenticated user)
exports.createQuery = async (req, res) => {
  try {
    const { subject, message, category } = req.body;

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Subject and message are required",
      });
    }

    const query = await Query.create({
      user: req.user.userId,
      subject,
      message,
      category,
    });

    res.status(201).json({
      success: true,
      message: "Query submitted successfully",
      data: query,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get queries (admin gets all, user gets own)
exports.getQueries = async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 20 } = req.query;
    const filter = {};

    // If not admin, only show own queries
    if (req.user.role !== "admin") {
      filter.user = req.user.userId;
    }

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Query.countDocuments(filter);

    const queries = await Query.find(filter)
      .populate("user", "name email phone role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: queries.length,
      total,
      data: queries,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update/respond to query (admin)
exports.updateQuery = async (req, res) => {
  try {
    const { status, response } = req.body;
    const update = {};

    if (status) update.status = status;
    if (response) {
      update.response = response;
      update.respondedAt = new Date();
    }

    const query = await Query.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    }).populate("user", "name email phone role");

    if (!query) {
      return res.status(404).json({ success: false, message: "Query not found" });
    }

    res.status(200).json({
      success: true,
      message: "Query updated successfully",
      data: query,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
