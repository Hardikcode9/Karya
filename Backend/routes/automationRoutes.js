const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {
  getActiveSessionDetails,
  triggerOrderAutomation,
  getAutomationHistory,
} = require("../controllers/automationController");

// Tolerant auth middleware: attaches user if token exists, otherwise allows demo access
const tolerantAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "karya_super_secret_jwt_key_development_2026"
      );
      req.user = decoded;
    }
  } catch (err) {
    // If token is invalid or expired, leave req.user empty
    req.user = null;
  }
  next();
};

// GET active backend session and latest booking
router.get("/session", tolerantAuth, getActiveSessionDetails);

// POST trigger complete automation pipeline: user check -> receipt -> email -> confirmation call
router.post("/trigger", tolerantAuth, triggerOrderAutomation);

// GET recent automation history and logs
router.get("/history", tolerantAuth, getAutomationHistory);

module.exports = router;
