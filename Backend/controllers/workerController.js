const WorkerProfile = require("../models/WorkerProfile");

const getWorkers = async (req, res) => {
  try {
    const workers = await WorkerProfile.find({ isAvailable: true })
      .populate("user", "name phone")
      .populate("service", "name category")
      .sort({ rating: -1 });

    res.status(200).json({
      success: true,
      count: workers.length,
      workers,
    });
  } catch (error) {
    console.error("Get Workers Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch workers",
    });
  }
};

module.exports = {
  getWorkers,
};