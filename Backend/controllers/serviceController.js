const mongoose = require("mongoose");
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

    const services = await Service.find(filter).sort({ name: 1 });

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
    const { name, category, description, icon, image } = req.body;

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
      image,
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

const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    let service;

    if (mongoose.Types.ObjectId.isValid(id)) {
      service = await Service.findById(id);
    }

    if (!service) {
      const mockMap = {
        s1: "Plumbing",
        s2: "Electrical",
        s3: "Carpentry",
        s4: "Cleaning",
        s5: "Construction",
        s6: "Farming Help",
        s7: "Transportation",
        s8: "Household Work",
      };
      const searchName = mockMap[id] || id;
      service = await Service.findOne({
        name: { $regex: searchName, $options: "i" },
      });
    }

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      service,
    });
  } catch (error) {
    console.error("Get Service By Id Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch service",
    });
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
};


