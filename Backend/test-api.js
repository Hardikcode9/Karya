const axios = require("axios");

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

async function runTest() {
  try {
    require('dotenv').config({path: 'C:/Users/jeeha/Desktop/Karya/Backend/.env'});
    
    // 1. Register a customer
    const cRes = await api.post("/auth/register", {
      name: "Test Customer",
      email: "testcust" + Date.now() + "@test.com",
      phone: "99999" + Math.floor(Math.random() * 99999),
      password: "password123",
      role: "customer"
    });
    console.log("Customer registered:", cRes.data.user.id);
    
    // 2. Login customer to get token
    const cLogin = await api.post("/auth/login", {
      email: cRes.data.user.email,
      password: "password123"
    });
    const cToken = cLogin.data.token;
    console.log("Customer token:", cToken.substring(0, 10) + "...");

    // 3. Register a worker
    const wRes = await api.post("/auth/register", {
      name: "Test Worker",
      email: "testwork" + Date.now() + "@test.com",
      phone: "88888" + Math.floor(Math.random() * 99999),
      password: "password123",
      role: "worker"
    });
    console.log("Worker registered:", wRes.data.user.id);
    
    // 4. Login worker to get token
    const wLogin = await api.post("/auth/login", {
      email: wRes.data.user.email,
      password: "password123"
    });
    const wToken = wLogin.data.token;
    console.log("Worker token:", wToken.substring(0, 10) + "...");

    // 5. Get worker profile ID
    const mongoose = require('mongoose');
    await mongoose.connect(process.env.MONGO_URI);
    const WorkerProfile = mongoose.connection.collection('workerprofiles');
    const wp = await WorkerProfile.findOne({ user: new mongoose.Types.ObjectId(wRes.data.user.id) });
    console.log("WorkerProfile ID:", wp._id);
    
    const Service = mongoose.connection.collection('services');
    const s = await Service.findOne({});

    // 6. Customer creates a booking
    const bRes = await api.post("/bookings", {
      worker: wp._id,
      service: s._id,
      scheduledDate: new Date(Date.now() + 86400000).toISOString(),
      duration: 60,
      address: "123 Test St",
      notes: "Test booking"
    }, {
      headers: { Authorization: "Bearer " + cToken }
    });
    console.log("Booking created:", bRes.data.booking._id);

    // 7. Worker accepts the booking
    const aRes = await api.patch(`/bookings/${bRes.data.booking._id}/status`, {
      status: "accepted"
    }, {
      headers: { Authorization: "Bearer " + wToken }
    });
    console.log("Booking accepted:", aRes.data.success);

    // 8. Fetch notifications for worker
    const wNotifs = await api.get("/notifications", {
      headers: { Authorization: "Bearer " + wToken }
    });
    console.log("Worker notifications:", wNotifs.data.notifications.length);

    // 9. Fetch notifications for customer
    const cNotifs = await api.get("/notifications", {
      headers: { Authorization: "Bearer " + cToken }
    });
    console.log("Customer notifications:", cNotifs.data.notifications.length);

    process.exit(0);
  } catch (err) {
    console.error("Test failed:", err.response ? err.response.data : err.message);
    process.exit(1);
  }
}

runTest();
