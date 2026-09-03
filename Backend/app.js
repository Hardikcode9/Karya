const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const serviceRoutes = require("./routes/serviceRoutes");
const workerRoutes = require("./routes/workerRoutes");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();
app.use("/api/auth", authRoutes);

app.use("/api/services", serviceRoutes);
app.use("/api/workers", workerRoutes);


app.get("/api/test-protected", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "You are authenticated!",
    user: req.user,
  });
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "KARYA Backend is running 🚀"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`KARYA Backend running on port ${PORT}`);
});