const Service = require("../models/Service");

// Get all active services
const getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({
      name: 1,
    });

    res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    console.error("Get Services Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch services",
    });
  }
};

module.exports = {
  getServices,
};