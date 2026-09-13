const Earning = require("../models/Earning");
const WorkerProfile = require("../models/WorkerProfile");

const getWorkerEarnings = async (req, res) => {
  try {
    if (req.user.role !== "worker") {
      return res.status(403).json({
        success: false,
        message: "Only workers can access earnings",
      });
    }

    const workerProfile = await WorkerProfile.findOne({
      user: req.user.userId,
    });

    if (!workerProfile) {
      return res.status(404).json({
        success: false,
        message: "Worker profile not found",
      });
    }

    const earnings = await Earning.find({
      worker: workerProfile._id,
    })
      .populate({
        path: "booking",
        populate: [
          { path: "customer", select: "name phone email" },
          { path: "service", select: "name category" }
        ]
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: earnings.length,
      earnings,
    });
  } catch (error) {
    console.error("Get Worker Earnings Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch earnings",
    });
  }
};

module.exports = {
  getWorkerEarnings,
};
