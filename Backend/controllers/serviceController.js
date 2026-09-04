const Service = require("../models/Service");

// Get services with optional search/category filters
const getServices = async (req, res) => {
  try {
    const { search, category } = req.query;

    const filter = {
      isActive: true,
    };

    // Search by service name
    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    // Filter by category
    if (category) {
      filter.category = {
        $regex: category,
        $options: "i",
      };
    }

    const services = await Service.find(filter)
      .sort({ name: 1 });

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

