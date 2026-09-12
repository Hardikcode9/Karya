const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User");
const Service = require("../models/Service");
const WorkerProfile = require("../models/WorkerProfile");

const customSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/karya");

    console.log("MongoDB connected");

    // Clear existing data (optional, but good for a fresh seed)
    await WorkerProfile.deleteMany({});
    await User.deleteMany({});
    await Service.deleteMany({});

    // -------------------------
    // SERVICES
    // -------------------------
    const serviceNames = [
      "carpentry",
      "cleaning",
      "construction",
      "electrical",
      "farming",
      "gardening",
      "household work",
      "plumbing",
      "transportation"
    ];

    const serviceDocs = await Service.insertMany(
      serviceNames.map(name => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        category: "General",
        description: `${name} services`,
        isActive: true,
      }))
    );

    console.log(`Created ${serviceDocs.length} services.`);

    // -------------------------
    // WORKERS & CUSTOMERS DATA
    // -------------------------
    const workerNames = [
      "suresh", "naman", "pratham", "roshan", 
      "siddhant", "vaibhav", "vinit", "abdul", 
      "aryan", "harshit"
    ];
    
    const customerNames = ["subhankar", "hardik", "shubham"];

    let phoneCounter = 9000000000;

    const createUserData = async (name, role) => {
      const email = `${name}bhai@gmail.com`.toLowerCase();
      const password = `${name}bhai123`.toLowerCase();
      const hashedPassword = await bcrypt.hash(password, 10);
      
      return {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email,
        phone: (phoneCounter++).toString(),
        password: hashedPassword,
        role: role,
        isVerified: true,
      };
    };

    // -------------------------
    // CREATE USERS
    // -------------------------
    const workerPromises = workerNames.map(name => createUserData(name, "worker"));
    const customerPromises = customerNames.map(name => createUserData(name, "customer"));

    const workerData = await Promise.all(workerPromises);
    const customerData = await Promise.all(customerPromises);

    const workers = await User.insertMany(workerData);
    const customers = await User.insertMany(customerData);

    console.log(`Created ${workers.length} workers.`);
    console.log(`Created ${customers.length} customers.`);

    // -------------------------
    // WORKER PROFILES
    // -------------------------
    const profileDocs = workers.map((worker, index) => {
      // Loop services for workers (since 10 workers, 9 services)
      const service = serviceDocs[index % serviceDocs.length];
      
      return {
        user: worker._id,
        service: service._id,
        bio: `Professional in ${service.name}`,
        experience: Math.floor(Math.random() * 5) + 1,
        skills: [service.name],
        pricePerService: 500,
        location: {
          type: "Point",
          coordinates: [77.2090, 28.6139],
        },
        isAvailable: true,
        rating: 4.5,
        totalReviews: 10,
      };
    });

    await WorkerProfile.insertMany(profileDocs);
    console.log(`Created ${profileDocs.length} worker profiles.`);

    console.log("Custom seed data inserted successfully");
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seed Error:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

customSeed();
