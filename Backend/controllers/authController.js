const bcrypt = require("bcryptjs");
const User = require("../models/User");

const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // Check required fields
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, phone and password",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Check if phone already exists
    const existingPhone = await User.findOne({ phone });

    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone number already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: role || "customer",
    });

    // If role is worker, create matching WorkerProfile document
    if (user.role === "worker") {
      const mongoose = require("mongoose");
      const Service = require("../models/Service");
      const WorkerProfile = require("../models/WorkerProfile");

      const userSkill =
        req.body.service ||
        req.body.skillOrCatalog ||
        req.body.skill ||
        req.body.role ||
        "General Trade";

      let serviceDoc;

      if (mongoose.Types.ObjectId.isValid(userSkill)) {
        serviceDoc = await Service.findById(userSkill);
      }

      if (!serviceDoc) {
        serviceDoc = await Service.findOne({
          name: { $regex: userSkill, $options: "i" },
        });
      }

      if (!serviceDoc) {
        serviceDoc = await Service.findOne({ isActive: true });
      }

      if (!serviceDoc) {
        const serviceName =
          typeof userSkill === "string" && userSkill.length > 2
            ? userSkill
            : "General Repair";
        serviceDoc = await Service.create({
          name: serviceName,
          category: "General Services",
          description: `${serviceName} service offered by verified local specialists`,
          icon: "Wrench",
          isActive: true,
        });
      }

      await WorkerProfile.create({
        user: user._id,
        service: serviceDoc._id,
        bio: `${user.name} is a verified ${serviceDoc.name} specialist.`,
        experience: 3,
        skills: [serviceDoc.name],
        pricePerService: 350,
        location: {
          type: "Point",
          coordinates: [77.209, 28.6139],
        },
        isAvailable: true,
        rating: 4.8,
        totalReviews: 5,
      });
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};