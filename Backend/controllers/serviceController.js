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

const createService = async (req, res) => {
  try {
    const { name, category, description, icon } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: "Name and category are required",
      });
    }

    const existingService = await Service.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });

    if (existingService) {
      return res.status(400).json({
        success: false,
        message: "Service already exists",
      });
    }

    const service = await Service.create({
      name,
      category,
      description,
      icon,
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    console.error("Create Service Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create service",
    });
  }
};

module.exports = {
  getServices,
  createService,
};

