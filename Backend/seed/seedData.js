const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

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
    console.log("Clearing existing data...");
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
    // SERVICES
    // ==========================================
    console.log("Creating services...");
    const services = await Service.insertMany([
      {
        name: "Plumbing",
        category: "Home Repair",
        description: "Pipe repair, leakage repair, tap installation and plumbing maintenance",
        icon: "plumbing",
        image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Electrical",
        category: "Home Repair",
        description: "Electrical wiring, switch repair, fan installation and maintenance",
        icon: "electrical",
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Carpentry",
        category: "Home Repair",
        description: "Furniture repair, door repair and custom carpentry work",
        icon: "carpentry",
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Cleaning",
        category: "Household",
        description: "House cleaning, deep cleaning and regular cleaning services",
        icon: "cleaning",
        image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Gardening",
        category: "Household",
        description: "Garden maintenance, plant care and landscaping services",
        icon: "gardening",
        image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Tailoring",
        category: "SHG Craft",
        description: "Stitching, embroidery, alterations and school uniforms",
        icon: "tailoring",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Handicrafts",
        category: "SHG Craft",
        description: "Handmade bamboo, pottery, and decorative items",
        icon: "handicrafts",
        image: "https://images.unsplash.com/photo-1528396518501-b53b655eb9b3?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Catering",
        category: "SHG Service",
        description: "Bulk cooking and catering for events and community meals",
        icon: "catering",
        image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Construction",
        category: "Home Repair",
        description: "Masonry, wall repair, and small construction projects",
        icon: "construction",
        image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Farming Help",
        category: "Agriculture",
        description: "Seasonal farming help, sowing, harvesting, and irrigation",
        icon: "farming",
        image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80",
      },
    ]);
    console.log(`Created ${services.length} services`);

    const svcMap = {};
    services.forEach((s) => (svcMap[s.name] = s));

    // ==========================================
    // ADMIN USER
    // ==========================================
    console.log("Creating admin user...");
    const adminUser = await User.create({
      name: "Vikramaditya Solanki",
      email: "admin@karya.in",
      phone: "9422099881",
      password: hashedPassword,
      role: "admin",
      isVerified: true,
      state: "Madhya Pradesh",
      district: "Ashoknagar",
      village: "Headquarters",
    });

    // ==========================================
    // CUSTOMER USERS
    // ==========================================
    console.log("Creating customer users...");
    const customers = await User.insertMany([
      {
        name: "Vikram Deshmukh",
        email: "vikram.customer@example.com",
        phone: "9822044512",
        password: hashedPassword,
        role: "customer",
        isVerified: true,
        state: "Maharashtra",
        district: "Pune",
        village: "Devgaon",
      },
      {
        name: "Anita Kumari Roy",
        email: "anita.customer@example.com",
        phone: "9711033490",
        password: hashedPassword,
        role: "customer",
        isVerified: true,
        state: "Maharashtra",
        district: "Nashik",
        village: "Rampura",
      },
      {
        name: "Sanjay Borse",
        email: "sanjay.customer@example.com",
        phone: "9890177218",
        password: hashedPassword,
        role: "customer",
        isVerified: true,
        state: "Maharashtra",
        district: "Aurangabad",
        village: "Sonipur",
      },
      {
        name: "Anjali Sharma",
        email: "anjali.customer@example.com",
        phone: "9811244921",
        password: hashedPassword,
        role: "customer",
        isVerified: true,
        state: "Delhi",
        district: "New Delhi",
        village: "Connaught Place",
      },
      {
        name: "Dr. Harish Vyas",
        email: "harish.customer@example.com",
        phone: "9827044199",
        password: hashedPassword,
        role: "customer",
        isVerified: true,
        state: "Madhya Pradesh",
        district: "Indore",
        village: "Sanwer Road",
      },
    ]);
    console.log(`Created ${customers.length} customers`);

    // ==========================================
    // WORKER USERS + PROFILES
    // ==========================================
    console.log("Creating worker users and profiles...");
    const workerData = [
      {
        user: { name: "Rahul Kumar", email: "rahul.worker@example.com", phone: "9000000001", state: "Madhya Pradesh", district: "Ashoknagar", village: "Sonipur" },
        profile: { service: svcMap["Plumbing"]._id, bio: "Experienced plumber specializing in pipe and leakage repairs.", experience: 6, skills: ["Pipe Repair", "Leakage Repair", "Tap Installation"], pricePerService: 500, location: { type: "Point", coordinates: [77.73, 24.57] }, rating: 4.7, totalReviews: 86 },
      },
      {
        user: { name: "Amit Sharma", email: "amit.worker@example.com", phone: "9000000002", state: "Madhya Pradesh", district: "Ashoknagar", village: "Sonipur" },
        profile: { service: svcMap["Electrical"]._id, bio: "Certified electrician with residential work experience.", experience: 5, skills: ["Wiring", "Fan Installation", "Switch Repair", "Solar Panels"], pricePerService: 600, location: { type: "Point", coordinates: [77.74, 24.58] }, rating: 4.5, totalReviews: 72 },
      },
      {
        user: { name: "Priya Devi", email: "priya.worker@example.com", phone: "9000000003", state: "Maharashtra", district: "Nashik", village: "Rampura" },
        profile: { service: svcMap["Cleaning"]._id, bio: "Professional home cleaner specializing in deep cleaning.", experience: 4, skills: ["Deep Cleaning", "Kitchen Cleaning", "Bathroom Cleaning"], pricePerService: 400, location: { type: "Point", coordinates: [73.79, 20.00] }, rating: 4.8, totalReviews: 105 },
      },
      {
        user: { name: "Suresh Kumar", email: "suresh.worker@example.com", phone: "9000000004", state: "Maharashtra", district: "Pune", village: "Devgaon" },
        profile: { service: svcMap["Carpentry"]._id, bio: "Skilled carpenter experienced in furniture and door repairs.", experience: 8, skills: ["Furniture Repair", "Door Repair", "Wood Work", "Interior Work"], pricePerService: 800, location: { type: "Point", coordinates: [73.86, 18.52] }, rating: 4.6, totalReviews: 91 },
      },
      {
        user: { name: "Neha Singh", email: "neha.worker@example.com", phone: "9000000005", state: "Madhya Pradesh", district: "Bhopal", village: "Berasia" },
        profile: { service: svcMap["Gardening"]._id, bio: "Gardening professional providing plant care and garden maintenance.", experience: 3, skills: ["Plant Care", "Garden Maintenance", "Landscaping"], pricePerService: 350, location: { type: "Point", coordinates: [77.41, 23.26] }, rating: 4.3, totalReviews: 48 },
      },
      {
        user: { name: "Sunita Devi", email: "sunita.worker@example.com", phone: "9000000006", state: "Madhya Pradesh", district: "Ashoknagar", village: "Sonipur" },
        profile: { service: svcMap["Tailoring"]._id, bio: "Master weaver and tailor with 14+ years of heritage in Chanderi weaving.", experience: 14, skills: ["Pit-Loom Weaving", "Zari Border", "Vegetable Dyeing", "Blouse Stitching"], pricePerService: 350, location: { type: "Point", coordinates: [77.72, 24.56] }, rating: 4.9, totalReviews: 120 },
      },
      {
        user: { name: "Radha Kol", email: "radha.worker@example.com", phone: "9000000007", state: "Madhya Pradesh", district: "Ashoknagar", village: "Mainar" },
        profile: { service: svcMap["Farming Help"]._id, bio: "Forest produce specialist and honey gatherer under Van Dhan Kendra.", experience: 11, skills: ["Honey Extraction", "Quality Testing", "FSSAI Packaging"], pricePerService: 420, location: { type: "Point", coordinates: [77.71, 24.55] }, rating: 4.7, totalReviews: 65 },
      },
      {
        user: { name: "Geeta Prajapati", email: "geeta.worker@example.com", phone: "9000000008", state: "Madhya Pradesh", district: "Ashoknagar", village: "Sonipur" },
        profile: { service: svcMap["Handicrafts"]._id, bio: "Master potter crafting alkaline earthen cookware using indigenous kilns.", experience: 16, skills: ["Porous Clay Throwing", "Kiln Firing", "Alkaline Curing"], pricePerService: 650, location: { type: "Point", coordinates: [77.73, 24.57] }, rating: 4.8, totalReviews: 78 },
      },
    ];

    const workerUsers = [];
    const workerProfiles = [];

    for (const wd of workerData) {
      const user = await User.create({
        ...wd.user,
        password: hashedPassword,
        role: "worker",
        isVerified: true,
      });
      workerUsers.push(user);

      const profile = await WorkerProfile.create({
        ...wd.profile,
        user: user._id,
        isAvailable: true,
      });
      workerProfiles.push(profile);
    }
    console.log(`Created ${workerUsers.length} workers with profiles`);

    // ==========================================
    // SHG USERS + PROFILES
    // ==========================================
    console.log("Creating SHG users and profiles...");

    const shgUser1 = await User.create({
      name: "Samman Mahila SHG",
      email: "samman.shg@example.com",
      phone: "9423081000",
      password: hashedPassword,
      role: "shg",
      isVerified: true,
      state: "Madhya Pradesh",
      district: "Ashoknagar",
      village: "Sonipur",
    });

    const shg1 = await SHGProfile.create({
      user: shgUser1._id,
      shgName: "Samman Mahila Swayam Sahayata Samuh",
      registrationId: "NRLM-MP-2024-8849",
      village: "Sonipur",
      district: "Ashoknagar",
      state: "Madhya Pradesh",
      contactNumber: "9423081000",
      email: "samman.shg@example.com",
      description: "Women-led cooperative producing handloom textiles, forest produce, and traditional pottery.",
      cluster: "Panchayat Cluster Sonipur & Rampura",
      bankName: "State Bank of India (Sonipur Rural Branch)",
      upiId: "samman.shg@sbi",
      establishedDate: new Date("2023-01-15"),
      verificationStatus: "verified",
      services: [svcMap["Tailoring"]._id, svcMap["Handicrafts"]._id, svcMap["Catering"]._id],
      members: [
        { worker: workerProfiles[5]._id, memberRole: "leader", isActive: true },
        { worker: workerProfiles[6]._id, memberRole: "coordinator", isActive: true },
        { worker: workerProfiles[7]._id, memberRole: "member", isActive: true },
      ],
      rating: 4.9,
      totalReviews: 86,
    });

    const shgUser2 = await User.create({
      name: "Annapurna Kitchen SHG",
      email: "annapurna.shg@example.com",
      phone: "9423081001",
      password: hashedPassword,
      role: "shg",
      isVerified: true,
      state: "Maharashtra",
      district: "Amravati",
      village: "Bhagwanpur",
    });

    const shg2 = await SHGProfile.create({
      user: shgUser2._id,
      shgName: "Annapurna Kitchen SHG",
      registrationId: "NRLM-MH-2024-4412",
      village: "Bhagwanpur",
      district: "Amravati",
      state: "Maharashtra",
      contactNumber: "9423081001",
      email: "annapurna.shg@example.com",
      description: "Community kitchen collective catering weddings, festivals and school midday meals.",
      cluster: "Bhagwanpur Tehsil",
      bankName: "Bank of Maharashtra (Bhagwanpur Branch)",
      upiId: "annapurna.shg@bom",
      establishedDate: new Date("2022-06-10"),
      verificationStatus: "verified",
      services: [svcMap["Catering"]._id],
      members: [],
      rating: 4.8,
      totalReviews: 42,
    });

    const shgUser3 = await User.create({
      name: "Surya Handicrafts SHG",
      email: "surya.shg@example.com",
      phone: "9881234509",
      password: hashedPassword,
      role: "shg",
      isVerified: true,
      state: "Maharashtra",
      district: "Pune",
      village: "Devgaon",
    });

    const shg3 = await SHGProfile.create({
      user: shgUser3._id,
      shgName: "Surya Handicrafts Collective",
      registrationId: "NRLM-MH-2024-5501",
      village: "Devgaon",
      district: "Pune",
      state: "Maharashtra",
      contactNumber: "9881234509",
      email: "surya.shg@example.com",
      description: "Bamboo and jute product makers with an expanding online presence.",
      cluster: "Devgaon Cluster",
      bankName: "Pune District Central Cooperative Bank",
      upiId: "surya.shg@pnb",
      establishedDate: new Date("2021-03-20"),
      verificationStatus: "pending",
      services: [svcMap["Handicrafts"]._id],
      members: [],
      rating: 4.7,
      totalReviews: 31,
    });

    console.log("Created 3 SHGs");

    // ==========================================
    // PRODUCTS (for SHG1)
    // ==========================================
    console.log("Creating SHG products...");
    const products = await Product.insertMany([
      { shg: shg1._id, name: "Handloom Chanderi Pure Cotton Saree", description: "Artisan pit-loom woven saree with natural azo-free dyes", sku: "CHN-COT-01", category: "Handloom", price: 1450, unit: "piece", stock: 18, artisanLead: "Sunita Devi (Master Weaver)", certifications: ["GI Certified", "NRLM Artisan"] },
      { shg: shg1._id, name: "Raw Wild Forest Honey (500g Jar)", description: "100% natural unheated honey gathered by Van Dhan tribal collective", sku: "HNY-FOR-02", category: "Forest Produce", price: 420, unit: "jar", stock: 45, artisanLead: "Radha Kol (Van Dhan Lead)", certifications: ["FSSAI Organic"] },
      { shg: shg1._id, name: "Natural Terracotta Cooking Handi & Curd Set", description: "Porous alkaline earthen cookware with lid, retains 98% nutrients", sku: "MIT-CLY-03", category: "Pottery", price: 650, unit: "set", stock: 24, artisanLead: "Geeta Prajapati (Potter Lead)", certifications: ["Kiln Baked"] },
      { shg: shg1._id, name: "Traditional Madhubani Canvas Scroll", description: "Natural mineral dyes on handmade paper with bamboo scroll hanger", sku: "ART-MAD-04", category: "Folk Art", price: 890, unit: "piece", stock: 8, artisanLead: "Urmila Devi (Artisan)", certifications: ["GI Certified Style"] },
      { shg: shg1._id, name: "Braided Golden Bamboo Fruit Baskets", description: "Set of 2 stackable golden cane baskets woven from local bamboo", sku: "BAM-BSK-05", category: "Bamboo Craft", price: 480, unit: "set", stock: 30, artisanLead: "Malati Barman (Bamboo Cell)", certifications: ["Eco-Polished"] },
      { shg: shg1._id, name: "Lakadong Stone-Ground Turmeric Powder (250g)", description: "7.5% curcumin purity organic turmeric, stone ground", sku: "AGR-TUR-06", category: "Agro Products", price: 260, unit: "pack", stock: 60, artisanLead: "Baphira Shullai (Agro Lead)", certifications: ["Lab Tested"] },
      { shg: shg1._id, name: "Gramin Woodfire Traditional Catering Service", description: "Full catering for 50-300 people: millet rotis, organic lentils, seasonal sabzi", sku: "CAT-GRAM-07", category: "Catering Service", price: 180, unit: "thali", stock: 999, artisanLead: "Kanti Bai (Kitchen Lead)", certifications: [] },
      { shg: shg1._id, name: "Solar Charkha Khadi Cotton Yardage (2.5m)", description: "Ultra-breathable handspun organic cotton fabric in natural unbleached ivory", sku: "KHD-FAB-08", category: "Handloom", price: 780, unit: "cut", stock: 15, artisanLead: "Kamlesh Kumari (Spinning Cell)", certifications: ["Zero-Carbon"] },
    ]);
    console.log(`Created ${products.length} products`);

    // ==========================================
    // BOOKINGS
    // ==========================================
    console.log("Creating bookings...");
    const now = new Date();
    const daysAgo = (d) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000);

    const bookings = await Booking.insertMany([
      // Worker bookings
      { customer: customers[0]._id, worker: workerProfiles[3]._id, providerType: "worker", service: svcMap["Carpentry"]._id, scheduledDate: daysAgo(2), duration: 120, address: "House 42, Devgaon Main Road, Pune", price: 1600, status: "completed" },
      { customer: customers[1]._id, worker: workerProfiles[2]._id, providerType: "worker", service: svcMap["Cleaning"]._id, scheduledDate: daysAgo(5), duration: 180, address: "Rampura Village Lane 3, Nashik", price: 1200, status: "completed" },
      { customer: customers[2]._id, worker: workerProfiles[0]._id, providerType: "worker", service: svcMap["Plumbing"]._id, scheduledDate: daysAgo(1), duration: 60, address: "Sonipur Farm Belt, Aurangabad", price: 500, status: "in_progress" },
      { customer: customers[0]._id, worker: workerProfiles[1]._id, providerType: "worker", service: svcMap["Electrical"]._id, scheduledDate: daysAgo(10), duration: 90, address: "Devgaon East Block, Pune", price: 600, status: "completed" },
      { customer: customers[2]._id, worker: workerProfiles[4]._id, providerType: "worker", service: svcMap["Gardening"]._id, scheduledDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), duration: 240, address: "Sonipur Residential Area, Aurangabad", price: 1400, status: "pending" },
      { customer: customers[1]._id, worker: workerProfiles[0]._id, providerType: "worker", service: svcMap["Plumbing"]._id, scheduledDate: daysAgo(15), duration: 60, address: "Rampura Market, Nashik", price: 500, status: "completed" },
      { customer: customers[0]._id, worker: workerProfiles[3]._id, providerType: "worker", service: svcMap["Carpentry"]._id, scheduledDate: daysAgo(20), duration: 180, address: "Devgaon West, Pune", price: 2400, status: "completed" },
      { customer: customers[4]._id, worker: workerProfiles[1]._id, providerType: "worker", service: svcMap["Electrical"]._id, scheduledDate: daysAgo(3), duration: 120, address: "Sanwer Road Industrial Area, Indore", price: 1200, status: "accepted" },

      // SHG bookings
      { customer: customers[3]._id, shg: shg1._id, providerType: "shg", service: svcMap["Tailoring"]._id, scheduledDate: daysAgo(0), duration: 480, address: "Khadi Gramodyog Bhawan, Connaught Place, New Delhi", notes: "Custom Chanderi sarees batch of 10", price: 14500, status: "accepted", assignedWorkers: [workerProfiles[5]._id] },
      { customer: customers[3]._id, shg: shg1._id, providerType: "shg", service: svcMap["Handicrafts"]._id, scheduledDate: daysAgo(2), duration: 240, address: "Heritage Dining Hub, Sector 18 Market, Noida", notes: "25 Terracotta cooking sets", price: 8750, status: "completed", assignedWorkers: [workerProfiles[7]._id] },
      { customer: customers[4]._id, shg: shg1._id, providerType: "shg", service: svcMap["Farming Help"]._id, scheduledDate: daysAgo(5), duration: 480, address: "Swasthya Ayurvedic Compound, Indore", notes: "50kg Lakadong Turmeric Powder", price: 18000, status: "completed", assignedWorkers: [workerProfiles[6]._id] },
      { customer: customers[0]._id, shg: shg1._id, providerType: "shg", service: svcMap["Handicrafts"]._id, scheduledDate: daysAgo(12), duration: 120, address: "Plot 42, Sector 29, Gurugram", notes: "Madhubani scrolls corporate gift batch", price: 13350, status: "completed", assignedWorkers: [workerProfiles[7]._id] },
      { customer: customers[1]._id, shg: shg1._id, providerType: "shg", service: svcMap["Catering"]._id, scheduledDate: daysAgo(20), duration: 360, address: "Gram Panchayat Bhavan, Rampura Kalan", notes: "120 Thalis for Gram Sabha", price: 21600, status: "completed", assignedWorkers: [workerProfiles[5]._id, workerProfiles[6]._id] },
      // Cancelled booking
      { customer: customers[2]._id, worker: workerProfiles[2]._id, providerType: "worker", service: svcMap["Electrical"]._id, scheduledDate: daysAgo(8), duration: 60, address: "Sonipur Market, Aurangabad", price: 600, status: "cancelled" },
      // Pending SHG booking
      { customer: customers[4]._id, shg: shg1._id, providerType: "shg", service: svcMap["Tailoring"]._id, scheduledDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), duration: 480, address: "FabVillage Studio, Jaipur", notes: "40 Metre Khadi bolt", price: 12480, status: "pending" },
    ]);
    console.log(`Created ${bookings.length} bookings`);

    // ==========================================
    // PAYMENTS (for completed bookings)
    // ==========================================
    console.log("Creating payments...");
    const completedBookings = bookings.filter((b) => b.status === "completed");
    const paymentDocs = [];

    for (const booking of completedBookings) {
      const txnId = `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      paymentDocs.push({
        booking: booking._id,
        customer: booking.customer,
        worker: booking.worker || null,
        amount: booking.price,
        paymentMethod: ["upi", "cash", "upi", "card"][Math.floor(Math.random() * 4)],
        status: "paid",
        transactionId: txnId,
      });
    }

    const payments = await Payment.insertMany(paymentDocs);
    console.log(`Created ${payments.length} payments`);

    // ==========================================
    // RATINGS (for completed bookings)
    // ==========================================
    console.log("Creating ratings...");
    const reviewTexts = [
      "Excellent work! Very professional and on time.",
      "Great quality craftsmanship. Will hire again.",
      "Very satisfied with the service. Highly recommended.",
      "Good work overall. Minor delays but quality was top notch.",
      "Outstanding! The best artisan work I've seen.",
      "Prompt, clean, and efficient. Five stars!",
      "Beautiful handcrafted items. Perfect for gifting.",
      "Delivered exactly as promised. Premium quality.",
    ];

    const ratingDocs = completedBookings.map((booking, idx) => ({
      booking: booking._id,
      customer: booking.customer,
      worker: booking.worker || workerProfiles[5]._id,
      rating: [4, 5, 5, 4, 5, 5, 4, 5][idx % 8],
      review: reviewTexts[idx % reviewTexts.length],
    }));

    await Rating.insertMany(ratingDocs);
    console.log(`Created ${ratingDocs.length} ratings`);

    // ==========================================
    // COMMISSIONS
    // ==========================================
    console.log("Creating commissions...");
    const commissionDocs = payments.slice(0, 4).map((payment, idx) => ({
      booking: completedBookings[idx]._id,
      payment: payment._id,
      worker: completedBookings[idx].worker || workerProfiles[5]._id,
      grossAmount: payment.amount,
      commissionRate: 10,
      commissionAmount: Math.round(payment.amount * 0.1),
      workerEarning: Math.round(payment.amount * 0.9),
    }));

    await Commission.insertMany(commissionDocs);
    console.log(`Created ${commissionDocs.length} commissions`);

    // ==========================================
    // NOTIFICATIONS
    // ==========================================
    console.log("Creating notifications...");
    await Notification.insertMany([
      { recipient: customers[0]._id, title: "Booking Confirmed", message: "Your carpentry booking has been confirmed by Suresh Kumar.", type: "booking" },
      { recipient: customers[1]._id, title: "Payment Received", message: "Payment of ₹1,200 for cleaning service has been processed.", type: "payment" },
      { recipient: workerUsers[0]._id, title: "New Booking Request", message: "You have a new plumbing job request from Sanjay Borse.", type: "booking" },
      { recipient: workerUsers[3]._id, title: "Review Received", message: "Vikram Deshmukh has left a 5-star review for your carpentry work.", type: "review" },
      { recipient: shgUser1._id, title: "New Order", message: "New order received for Chanderi sarees batch from Delhi.", type: "booking" },
      { recipient: adminUser._id, title: "System Alert", message: "3 new SHG verification requests pending review.", type: "system" },
    ]);
    console.log("Created notifications");

    // ==========================================
    // CONTACT MESSAGES
    // ==========================================
    console.log("Creating contact messages...");
    await ContactMessage.insertMany([
      { name: "Rajesh Patel", email: "rajesh.p@gmail.com", phone: "9876543210", subject: "How to register as a worker?", message: "I am a carpenter in Bhopal. How can I register on Karya to get work?", status: "resolved" },
      { name: "Meena Kumari", email: "meena.k@yahoo.com", phone: "9123456789", subject: "SHG registration process", message: "Our women's group wants to register as SHG on Karya. What documents are needed?", status: "read" },
      { name: "Arun Singh", email: "arun.singh@outlook.com", phone: "9234567890", subject: "Payment issue", message: "My payment was deducted but service was not booked. Please help.", status: "new" },
      { name: "Priya Verma", email: "priya.v@gmail.com", subject: "Partnership inquiry", message: "We are an NGO working in rural UP. Would like to explore partnership with Karya.", status: "new" },
      { name: "Government Liaison Office", email: "liaison@mp.gov.in", phone: "9345678901", subject: "District-level SHG data", message: "Requesting aggregated SHG performance data for Ashoknagar district for policy review.", status: "new" },
    ]);
    console.log("Created contact messages");

    // ==========================================
    // QUERIES
    // ==========================================
    console.log("Creating queries...");
    await Query.insertMany([
      { user: customers[0]._id, subject: "Booking cancellation refund", message: "I cancelled my booking 2 days ago but haven't received the refund yet.", category: "payment", priority: "high", status: "open" },
      { user: customers[1]._id, subject: "Worker did not show up", message: "The plumber was scheduled for 10 AM but didn't arrive. No communication.", category: "booking", priority: "urgent", status: "in-progress", response: "We are contacting the worker and will assign a replacement within 2 hours." },
      { user: customers[2]._id, subject: "How to leave a review?", message: "I want to rate the carpenter who fixed my door. Where can I leave a review?", category: "service", priority: "low", status: "resolved", response: "You can leave a review from your Customer Dashboard > Reviews section." },
      { user: customers[3]._id, subject: "Bulk order discount", message: "Does Karya offer discounts for bulk SHG product orders? We want to order 50 sarees.", category: "other", priority: "medium", status: "open" },
      { user: customers[4]._id, subject: "Invoice download", message: "How can I download the invoice for my last 3 orders?", category: "payment", priority: "low", status: "resolved", response: "Invoices are available in your Payment History section." },
    ]);
    console.log("Created queries");

    // ==========================================
    // SUGGESTIONS
    // ==========================================
    console.log("Creating suggestions...");
    await Suggestion.insertMany([
      { user: customers[0]._id, title: "Add voice search in local language", description: "Many workers and customers in villages can't type well. Voice search in Hindi/Marathi would help a lot.", category: "feature", status: "accepted" },
      { user: customers[1]._id, title: "Show worker location on map", description: "It would be helpful to see nearby workers on a map instead of just a list.", category: "improvement", status: "reviewed" },
      { user: workerUsers[0]._id, title: "Add auto-accept for regular customers", description: "If I've served a customer 3+ times, auto-accept their bookings.", category: "feature", status: "pending" },
      { user: customers[2]._id, title: "Add rating filters", description: "Allow filtering workers by minimum rating (e.g., 4+ stars only).", category: "improvement", status: "implemented" },
      { user: workerUsers[3]._id, title: "Weekly earnings SMS", description: "Send weekly earnings summary via SMS for workers without internet.", category: "feature", status: "pending" },
    ]);
    console.log("Created suggestions");

    // ==========================================
    // DONE
    // ==========================================
    console.log("\n========================================");
    console.log("SEED COMPLETE!");
    console.log("========================================");
    console.log(`Admin:     admin@karya.in / Test@123`);
    console.log(`Customer:  vikram.customer@example.com / Test@123`);
    console.log(`Worker:    rahul.worker@example.com / Test@123`);
    console.log(`SHG:       samman.shg@example.com / Test@123`);
    console.log("========================================\n");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seed Error:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedData();
