const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const User = require("../models/User");
const Service = require("../models/Service");
const WorkerProfile = require("../models/WorkerProfile");
const SHGProfile = require("../models/SHGProfile");
const Product = require("../models/Product");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const Rating = require("../models/Rating");
const Commission = require("../models/Commission");
const Notification = require("../models/Notification");
const ContactMessage = require("../models/ContactMessage");
const Query = require("../models/Query");
const Suggestion = require("../models/Suggestion");

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding");

    // ==========================================
    // CLEAR ALL COLLECTIONS
    // ==========================================
    console.log("Clearing ALL existing data...");
    await Promise.all([
      User.deleteMany({}),
      Service.deleteMany({}),
      WorkerProfile.deleteMany({}),
      SHGProfile.deleteMany({}),
      Product.deleteMany({}),
      Booking.deleteMany({}),
      Payment.deleteMany({}),
      Rating.deleteMany({}),
      Commission.deleteMany({}),
      Notification.deleteMany({}),
      ContactMessage.deleteMany({}),
      Query.deleteMany({}),
      Suggestion.deleteMany({}),
    ]);
    console.log("All collections cleared");

    // ==========================================
    // PASSWORD
    // ==========================================
    const hashedPassword = await bcrypt.hash("Test@123", 10);

    // ==========================================
    // SERVICES (9)
    // ==========================================
    console.log("Creating 9 services...");
    const services = await Service.insertMany([
      {
        name: "Carpentry",
        category: "Home Repair",
        description: "Furniture repair, door fixing, wooden frame work and custom carpentry",
        icon: "carpentry",
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Cleaning",
        category: "Household",
        description: "House cleaning, deep cleaning, bathroom and kitchen cleaning services",
        icon: "cleaning",
        image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Construction",
        category: "Building",
        description: "Wall construction, plastering, tiling and small construction work",
        icon: "construction",
        image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Electrical",
        category: "Home Repair",
        description: "Electrical wiring, switch repair, fan installation and maintenance",
        icon: "electrical",
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Farming",
        category: "Agriculture",
        description: "Agricultural help, crop maintenance, irrigation setup and farming assistance",
        icon: "farming",
        image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Gardening",
        category: "Outdoor",
        description: "Garden maintenance, plant care, lawn mowing and landscaping",
        icon: "gardening",
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Household Work",
        category: "Household",
        description: "General household tasks, cooking help, washing and daily chores assistance",
        icon: "household",
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Plumbing",
        category: "Home Repair",
        description: "Pipe repair, leakage fix, tap installation and plumbing maintenance",
        icon: "plumbing",
        image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Transportation",
        category: "Logistics",
        description: "Goods transport, shifting help, delivery and logistics services",
        icon: "transportation",
        image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=600&q=80",
      },
    ]);
    console.log(`Created ${services.length} services`);

    // ==========================================
    // ADMIN USER (1)
    // ==========================================
    console.log("Creating admin user...");
    const adminUser = await User.create({
      name: "Admin",
      email: "admin@karya.in",
      phone: "+91 90000 00001",
      password: hashedPassword,
      role: "admin",
      isVerified: true,
      village: "Headquarters",
      district: "Delhi",
      state: "Delhi",
    });
    console.log("Admin created:", adminUser.email);

    // ==========================================
    // CUSTOMER USERS (3)
    // ==========================================
    console.log("Creating 3 customers...");
    const customers = await User.insertMany([
      {
        name: "Hardik",
        email: "hardik@karya.in",
        phone: "+91 91000 00001",
        password: hashedPassword,
        role: "customer",
        isVerified: true,
        village: "Rampur",
        district: "Gorakhpur",
        state: "Uttar Pradesh",
        location: { type: "Point", coordinates: [83.3732, 26.7606] },
      },
      {
        name: "Subhankar",
        email: "subhankar@karya.in",
        phone: "+91 91000 00002",
        password: hashedPassword,
        role: "customer",
        isVerified: true,
        village: "Sonipur",
        district: "Patna",
        state: "Bihar",
        location: { type: "Point", coordinates: [85.1376, 25.6093] },
      },
      {
        name: "Sumit",
        email: "sumit@karya.in",
        phone: "+91 91000 00003",
        password: hashedPassword,
        role: "customer",
        isVerified: true,
        village: "Chanderi",
        district: "Ashoknagar",
        state: "Madhya Pradesh",
        location: { type: "Point", coordinates: [78.1350, 24.7177] },
      },
    ]);
    console.log(`Created ${customers.length} customers`);

    // ==========================================
    // WORKER USERS (9) + WORKER PROFILES (9)
    // ==========================================
    console.log("Creating 9 workers...");
    const workerData = [
      { name: "Vaibhav",   email: "vaibhav@karya.in",   phone: "+91 92000 00001", serviceIdx: 0, exp: 5, price: 450, skills: ["Furniture Repair", "Door Fixing"],           coords: [83.37, 26.76] },
      { name: "Naman",     email: "naman@karya.in",     phone: "+91 92000 00002", serviceIdx: 1, exp: 3, price: 350, skills: ["Deep Cleaning", "Kitchen Cleaning"],          coords: [85.14, 25.61] },
      { name: "Aryan",     email: "aryan@karya.in",     phone: "+91 92000 00003", serviceIdx: 2, exp: 7, price: 600, skills: ["Wall Construction", "Plastering", "Tiling"],   coords: [78.14, 24.72] },
      { name: "Harsh",     email: "harsh@karya.in",     phone: "+91 92000 00004", serviceIdx: 3, exp: 4, price: 400, skills: ["Wiring", "Fan Installation", "Switch Repair"], coords: [83.38, 26.77] },
      { name: "Milind",    email: "milind@karya.in",    phone: "+91 92000 00005", serviceIdx: 4, exp: 6, price: 500, skills: ["Crop Maintenance", "Irrigation"],              coords: [85.15, 25.62] },
      { name: "Pratham",   email: "pratham@karya.in",   phone: "+91 92000 00006", serviceIdx: 5, exp: 2, price: 300, skills: ["Lawn Mowing", "Plant Care"],                   coords: [78.15, 24.73] },
      { name: "Roshan",    email: "roshan@karya.in",    phone: "+91 92000 00007", serviceIdx: 6, exp: 3, price: 350, skills: ["Cooking Help", "Daily Chores"],                coords: [83.39, 26.78] },
      { name: "Siddhant",  email: "siddhant@karya.in",  phone: "+91 92000 00008", serviceIdx: 7, exp: 5, price: 500, skills: ["Pipe Repair", "Leakage Fix"],                  coords: [85.16, 25.63] },
      { name: "Vinit",     email: "vinit@karya.in",     phone: "+91 92000 00009", serviceIdx: 8, exp: 4, price: 550, skills: ["Goods Transport", "Shifting"],                 coords: [78.16, 24.74] },
    ];

    const workerUsers = await User.insertMany(
      workerData.map((w) => ({
        name: w.name,
        email: w.email,
        phone: w.phone,
        password: hashedPassword,
        role: "worker",
        isVerified: true,
        village: "Rampur",
        district: "Gorakhpur",
        state: "Uttar Pradesh",
        location: { type: "Point", coordinates: w.coords },
      }))
    );

    const workerProfiles = await WorkerProfile.insertMany(
      workerData.map((w, i) => ({
        user: workerUsers[i]._id,
        service: services[w.serviceIdx]._id,
        bio: `Experienced ${services[w.serviceIdx].name.toLowerCase()} specialist with ${w.exp} years of rural service.`,
        experience: w.exp,
        skills: w.skills,
        pricePerService: w.price,
        location: { type: "Point", coordinates: w.coords },
        isAvailable: true,
        rating: 4.5 + Math.random() * 0.5,
        totalReviews: Math.floor(10 + Math.random() * 30),
      }))
    );
    console.log(`Created ${workerUsers.length} worker users + ${workerProfiles.length} worker profiles`);

    // ==========================================
    // SHG USERS (4) + SHG PROFILES (4)
    // ==========================================
    console.log("Creating 4 SHG groups...");
    const shgData = [
      {
        userName: "Sri Shakti",    email: "srishakti@karya.in",  phone: "+91 93000 00001",
        shgName: "Sri Shakti",     regId: "NRLM-SHG-2024-001",
        village: "Chanderi",       district: "Ashoknagar",       state: "Madhya Pradesh",
        cluster: "Bundelkhand Cluster", description: "Women-led handloom and textile cooperative preserving Chanderi weaving heritage.",
        rating: 4.8, totalReviews: 42,
      },
      {
        userName: "Vikas SHG",     email: "vikasshg@karya.in",   phone: "+91 93000 00002",
        shgName: "Vikas SHG",      regId: "NRLM-SHG-2024-002",
        village: "Sonipur",        district: "Gorakhpur",         state: "Uttar Pradesh",
        cluster: "Eastern UP Cluster", description: "Self-help group focusing on organic farming produce and dairy products.",
        rating: 4.6, totalReviews: 31,
      },
      {
        userName: "Ekta SHG",      email: "ektashg@karya.in",    phone: "+91 93000 00003",
        shgName: "Ekta SHG",       regId: "NRLM-SHG-2024-003",
        village: "Ranti",          district: "Madhubani",         state: "Bihar",
        cluster: "Mithila Cluster", description: "Artisan collective specializing in Madhubani paintings and folk art.",
        rating: 4.9, totalReviews: 56,
      },
      {
        userName: "Uday Kiran Group", email: "udaykiran@karya.in", phone: "+91 93000 00004",
        shgName: "Uday Kiran Group", regId: "NRLM-SHG-2024-004",
        village: "Kondagaon",      district: "Bastar",            state: "Chhattisgarh",
        cluster: "Bastar Tribal Cluster", description: "Tribal women cooperative producing bamboo crafts and forest produce.",
        rating: 4.7, totalReviews: 38,
      },
    ];

    const shgUsers = await User.insertMany(
      shgData.map((s) => ({
        name: s.userName,
        email: s.email,
        phone: s.phone,
        password: hashedPassword,
        role: "shg",
        isVerified: true,
        village: s.village,
        district: s.district,
        state: s.state,
        location: { type: "Point", coordinates: [0, 0] },
      }))
    );

    const shgProfiles = await SHGProfile.insertMany(
      shgData.map((s, i) => ({
        user: shgUsers[i]._id,
        shgName: s.shgName,
        registrationId: s.regId,
        village: s.village,
        district: s.district,
        state: s.state,
        contactNumber: s.phone,
        email: s.email,
        description: s.description,
        cluster: s.cluster,
        bankName: "State Bank of India",
        upiId: `${s.email.split("@")[0]}@sbi`,
        establishedDate: new Date("2024-01-15"),
        verificationStatus: "verified",
        services: [],
        members: [],
        rating: s.rating,
        totalReviews: s.totalReviews,
        isActive: true,
      }))
    );
    console.log(`Created ${shgUsers.length} SHG users + ${shgProfiles.length} SHG profiles`);

    // ==========================================
    // SAMPLE BOOKINGS (6) - for demo dashboards
    // ==========================================
    console.log("Creating sample bookings...");
    const now = new Date();
    const bookings = await Booking.insertMany([
      {
        customer: customers[0]._id, // Hardik
        worker: workerProfiles[0]._id, // Vaibhav - Carpentry
        service: services[0]._id,
        scheduledDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        duration: 120,
        address: "Ward #4, Near Panchayat Bhavan, Rampur",
        notes: "Fix main door and window frame",
        price: 450,
        status: "completed",
        providerType: "worker",
      },
      {
        customer: customers[1]._id, // Subhankar
        worker: workerProfiles[3]._id, // Harsh - Electrical
        service: services[3]._id,
        scheduledDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        duration: 90,
        address: "House #12, Sonipur Main Road",
        notes: "Complete house wiring check",
        price: 400,
        status: "completed",
        providerType: "worker",
      },
      {
        customer: customers[2]._id, // Sumit
        worker: workerProfiles[7]._id, // Siddhant - Plumbing
        service: services[7]._id,
        scheduledDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        duration: 60,
        address: "Chanderi Market Road, Block B",
        notes: "Kitchen pipe leakage",
        price: 500,
        status: "completed",
        providerType: "worker",
      },
      {
        customer: customers[0]._id, // Hardik
        worker: workerProfiles[1]._id, // Naman - Cleaning
        service: services[1]._id,
        scheduledDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
        duration: 180,
        address: "Ward #4, Near Panchayat Bhavan, Rampur",
        notes: "Full house deep cleaning",
        price: 350,
        status: "accepted",
        providerType: "worker",
      },
      {
        customer: customers[1]._id, // Subhankar
        worker: workerProfiles[5]._id, // Pratham - Gardening
        service: services[5]._id,
        scheduledDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
        duration: 120,
        address: "Sonipur Gram Panchayat Garden",
        notes: "Lawn maintenance and plant trimming",
        price: 300,
        status: "pending",
        providerType: "worker",
      },
      {
        customer: customers[2]._id, // Sumit
        worker: workerProfiles[8]._id, // Vinit - Transportation
        service: services[8]._id,
        scheduledDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        duration: 240,
        address: "Chanderi to Ashoknagar",
        notes: "Shift household items",
        price: 550,
        status: "pending",
        providerType: "worker",
      },
    ]);
    console.log(`Created ${bookings.length} bookings`);

    // ==========================================
    // SAMPLE PAYMENTS (3 for completed bookings)
    // ==========================================
    console.log("Creating sample payments...");
    const payments = await Payment.insertMany([
      {
        booking: bookings[0]._id,
        customer: customers[0]._id,
        worker: workerProfiles[0]._id,
        amount: 450,
        paymentMethod: "upi",
        status: "paid",
        transactionId: `TXN-${Date.now()}-1001`,
      },
      {
        booking: bookings[1]._id,
        customer: customers[1]._id,
        worker: workerProfiles[3]._id,
        amount: 400,
        paymentMethod: "cash",
        status: "paid",
        transactionId: `TXN-${Date.now()}-1002`,
      },
      {
        booking: bookings[2]._id,
        customer: customers[2]._id,
        worker: workerProfiles[7]._id,
        amount: 500,
        paymentMethod: "upi",
        status: "paid",
        transactionId: `TXN-${Date.now()}-1003`,
      },
    ]);
    console.log(`Created ${payments.length} payments`);

    // ==========================================
    // SAMPLE RATINGS (3 for completed bookings)
    // ==========================================
    console.log("Creating sample ratings...");
    const ratings = await Rating.insertMany([
      {
        booking: bookings[0]._id,
        customer: customers[0]._id,
        worker: workerProfiles[0]._id,
        rating: 5,
        review: "Vaibhav did excellent carpentry work. Door is now perfectly fixed!",
      },
      {
        booking: bookings[1]._id,
        customer: customers[1]._id,
        worker: workerProfiles[3]._id,
        rating: 4,
        review: "Harsh fixed all the electrical issues. Very professional and on time.",
      },
      {
        booking: bookings[2]._id,
        customer: customers[2]._id,
        worker: workerProfiles[7]._id,
        rating: 5,
        review: "Siddhant repaired the kitchen pipe leakage quickly. Highly recommended!",
      },
    ]);
    console.log(`Created ${ratings.length} ratings`);

    // ==========================================
    // SAMPLE COMMISSIONS (3 for completed bookings)
    // ==========================================
    console.log("Creating sample commissions...");
    const commissions = await Commission.insertMany([
      {
        booking: bookings[0]._id,
        payment: payments[0]._id,
        worker: workerProfiles[0]._id,
        grossAmount: 450,
        commissionRate: 10,
        commissionAmount: 45,
        workerEarning: 405,
      },
      {
        booking: bookings[1]._id,
        payment: payments[1]._id,
        worker: workerProfiles[3]._id,
        grossAmount: 400,
        commissionRate: 10,
        commissionAmount: 40,
        workerEarning: 360,
      },
      {
        booking: bookings[2]._id,
        payment: payments[2]._id,
        worker: workerProfiles[7]._id,
        grossAmount: 500,
        commissionRate: 10,
        commissionAmount: 50,
        workerEarning: 450,
      },
    ]);
    console.log(`Created ${commissions.length} commissions`);

    // ==========================================
    // SAMPLE NOTIFICATIONS
    // ==========================================
    console.log("Creating sample notifications...");
    const notifications = await Notification.insertMany([
      {
        recipient: customers[0]._id,
        title: "Booking Confirmed",
        message: "Your carpentry booking with Vaibhav has been confirmed.",
        type: "booking",
        relatedId: bookings[0]._id,
        isRead: true,
      },
      {
        recipient: customers[0]._id,
        title: "Payment Successful",
        message: "Payment of ₹450 for carpentry service has been received.",
        type: "payment",
        relatedId: payments[0]._id,
        isRead: true,
      },
      {
        recipient: customers[1]._id,
        title: "Booking Confirmed",
        message: "Your electrical service booking with Harsh has been confirmed.",
        type: "booking",
        relatedId: bookings[1]._id,
        isRead: false,
      },
      {
        recipient: customers[2]._id,
        title: "Booking Confirmed",
        message: "Your plumbing service booking with Siddhant has been confirmed.",
        type: "booking",
        relatedId: bookings[2]._id,
        isRead: false,
      },
      {
        recipient: workerUsers[0]._id,
        title: "New Booking Request",
        message: "You have a new carpentry booking from Hardik.",
        type: "booking",
        relatedId: bookings[0]._id,
        isRead: true,
      },
    ]);
    console.log(`Created ${notifications.length} notifications`);

    // ==========================================
    // SUMMARY
    // ==========================================
    console.log("\n========================================");
    console.log("SEED COMPLETE — Summary");
    console.log("========================================");
    console.log(`Admin:           1  (admin@karya.in / Test@123)`);
    console.log(`Customers:       ${customers.length}  (hardik, subhankar, sumit)`);
    console.log(`Workers:         ${workerUsers.length}  (vaibhav, naman, aryan, harsh, milind, pratham, roshan, siddhant, vinit)`);
    console.log(`Worker Profiles: ${workerProfiles.length}`);
    console.log(`SHG Users:       ${shgUsers.length}`);
    console.log(`SHG Profiles:    ${shgProfiles.length}  (Sri Shakti, Vikas SHG, Ekta SHG, Uday Kiran Group)`);
    console.log(`Services:        ${services.length}`);
    console.log(`Bookings:        ${bookings.length}`);
    console.log(`Payments:        ${payments.length}`);
    console.log(`Ratings:         ${ratings.length}`);
    console.log(`Commissions:     ${commissions.length}`);
    console.log(`Notifications:   ${notifications.length}`);
    console.log("========================================");
    console.log("All passwords: Test@123");
    console.log("========================================\n");

    await mongoose.connection.close();
    console.log("MongoDB connection closed. Done!");
    process.exit(0);
  } catch (error) {
    console.error("SEED FAILED:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedData();
