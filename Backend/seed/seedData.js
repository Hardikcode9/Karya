const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User");
const Service = require("../models/Service");
const WorkerProfile = require("../models/WorkerProfile");

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    // Clear existing test data
    await WorkerProfile.deleteMany({});
    await User.deleteMany({
      email: {
        $in: [
          "rahul.worker@example.com",
          "amit.worker@example.com",
          "priya.worker@example.com",
          "suresh.worker@example.com",
          "neha.worker@example.com",
          "vikas.worker@example.com",
        ],
      },
    });

    await Service.deleteMany({
      name: {
        $in: [
          "Plumbing",
          "Electrical",
          "Carpentry",
          "Cleaning",
          "Gardening",
        ],
      },
    });

    // -------------------------
    // SERVICES
    // -------------------------

    const services = await Service.insertMany([
      {
        name: "Plumbing",
        category: "Home Repair",
        description: "Pipe repair, leakage repair, tap installation and plumbing maintenance",
        icon: "plumbing",
        isActive: true,
      },
      {
        name: "Electrical",
        category: "Home Repair",
        description: "Electrical wiring, switch repair, fan installation and maintenance",
        icon: "electrical",
        isActive: true,
      },
      {
        name: "Carpentry",
        category: "Home Repair",
        description: "Furniture repair, door repair and custom carpentry work",
        icon: "carpentry",
        isActive: true,
      },
      {
        name: "Cleaning",
        category: "Household",
        description: "House cleaning, deep cleaning and regular cleaning services",
        icon: "cleaning",
        isActive: true,
      },
      {
        name: "Gardening",
        category: "Household",
        description: "Garden maintenance, plant care and landscaping services",
        icon: "gardening",
        isActive: true,
      },
    ]);

    const plumbing = services.find((s) => s.name === "Plumbing");
    const electrical = services.find((s) => s.name === "Electrical");
    const carpentry = services.find((s) => s.name === "Carpentry");
    const cleaning = services.find((s) => s.name === "Cleaning");
    const gardening = services.find((s) => s.name === "Gardening");

    // -------------------------
    // PASSWORD
    // -------------------------

    const hashedPassword = await bcrypt.hash("Test@123", 10);

    // -------------------------
    // WORKER USERS
    // -------------------------

    const users = await User.insertMany([
      {
        name: "Rahul Kumar",
        email: "rahul.worker@example.com",
        phone: "9000000001",
        password: hashedPassword,
        role: "worker",
        isVerified: true,
      },
      {
        name: "Amit Sharma",
        email: "amit.worker@example.com",
        phone: "9000000002",
        password: hashedPassword,
        role: "worker",
        isVerified: true,
      },
      {
        name: "Priya Devi",
        email: "priya.worker@example.com",
        phone: "9000000003",
        password: hashedPassword,
        role: "worker",
        isVerified: true,
      },
      {
        name: "Suresh Kumar",
        email: "suresh.worker@example.com",
        phone: "9000000004",
        password: hashedPassword,
        role: "worker",
        isVerified: true,
      },
      {
        name: "Neha Singh",
        email: "neha.worker@example.com",
        phone: "9000000005",
        password: hashedPassword,
        role: "worker",
        isVerified: true,
      },
      {
        name: "Vikas Verma",
        email: "vikas.worker@example.com",
        phone: "9000000006",
        password: hashedPassword,
        role: "worker",
        isVerified: true,
      },
    ]);

    // -------------------------
    // WORKER PROFILES
    // -------------------------

    await WorkerProfile.insertMany([
      {
        user: users[0]._id,
        service: plumbing._id,
        bio: "Experienced plumber specializing in pipe and leakage repairs.",
        experience: 6,
        skills: [
          "Pipe Repair",
          "Leakage Repair",
          "Tap Installation",
        ],
        pricePerService: 500,
        location: {
          type: "Point",
          coordinates: [77.2090, 28.6139],
        },
        isAvailable: true,
        rating: 4.7,
        totalReviews: 86,
      },

      {
        user: users[1]._id,
        service: electrical._id,
        bio: "Certified electrician with experience in residential electrical work.",
        experience: 5,
        skills: [
          "Wiring",
          "Fan Installation",
          "Switch Repair",
        ],
        pricePerService: 600,
        location: {
          type: "Point",
          coordinates: [77.2295, 28.6129],
        },
        isAvailable: true,
        rating: 4.5,
        totalReviews: 72,
      },

      {
        user: users[2]._id,
        service: cleaning._id,
        bio: "Professional home cleaner specializing in deep cleaning.",
        experience: 4,
        skills: [
          "Deep Cleaning",
          "Kitchen Cleaning",
          "Bathroom Cleaning",
        ],
        pricePerService: 400,
        location: {
          type: "Point",
          coordinates: [77.1910, 28.6280],
        },
        isAvailable: true,
        rating: 4.8,
        totalReviews: 105,
      },

      {
        user: users[3]._id,
        service: carpentry._id,
        bio: "Skilled carpenter experienced in furniture and door repairs.",
        experience: 8,
        skills: [
          "Furniture Repair",
          "Door Repair",
          "Wood Work",
        ],
        pricePerService: 800,
        location: {
          type: "Point",
          coordinates: [77.2500, 28.5900],
        },
        isAvailable: true,
        rating: 4.6,
        totalReviews: 91,
      },

      {
        user: users[4]._id,
        service: gardening._id,
        bio: "Gardening professional providing plant care and garden maintenance.",
        experience: 3,
        skills: [
          "Plant Care",
          "Garden Maintenance",
          "Landscaping",
        ],
        pricePerService: 350,
        location: {
          type: "Point",
          coordinates: [77.1800, 28.6200],
        },
        isAvailable: true,
        rating: 4.3,
        totalReviews: 48,
      },

      {
        user: users[5]._id,
        service: plumbing._id,
        bio: "Plumber specializing in household maintenance and bathroom fittings.",
        experience: 2,
        skills: [
          "Bathroom Fitting",
          "Tap Repair",
          "Pipe Installation",
        ],
        pricePerService: 350,
        location: {
          type: "Point",
          coordinates: [77.2300, 28.6400],
        },
        isAvailable: false,
        rating: 4.1,
        totalReviews: 32,
      },
    ]);

    console.log("Seed data inserted successfully");
    console.log(`Services created: ${services.length}`);
    console.log(`Workers created: ${users.length}`);

    await mongoose.connection.close();

    console.log("MongoDB connection closed");
    process.exit(0);
  } catch (error) {
    console.error("Seed Error:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedData();
