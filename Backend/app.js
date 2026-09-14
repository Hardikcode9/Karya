const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const path = require("path");
const express = require("express");
const cors = require("cors");

// Load .env relative to this file so startup works from any cwd,
// and let it override stray shell values like PORT=0.
require("dotenv").config({ path: path.join(__dirname, ".env"), override: true });

const connectDB = require("./config/db");

const serviceRoutes = require("./routes/serviceRoutes");
const workerRoutes = require("./routes/workerRoutes");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const commissionRoutes = require("./routes/commissionRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const shgRoutes = require("./routes/shgroutes");
const notificationRoutes = require("./routes/notificationRoutes");
const earningRoutes = require("./routes/earningRoutes");
const automationRoutes = require("./routes/automationRoutes");
const productRoutes = require("./routes/productRoutes");
const contactRoutes = require("./routes/contactRoutes");
const queryRoutes = require("./routes/queryRoutes");
const suggestionRoutes = require("./routes/suggestionRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/commissions", commissionRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/shg", shgRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/earnings", earningRoutes);
app.use("/api/automation", automationRoutes);
app.use("/api/products", productRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/queries", queryRoutes);
app.use("/api/suggestions", suggestionRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "KARYA Backend is running 🚀"
  });
});

const PORT =
  Number(process.env.PORT) > 0 ? Number(process.env.PORT) : 5000;

app.listen(PORT, () => {
  console.log(`KARYA Backend running on port ${PORT}`);
});

module.exports = app;
