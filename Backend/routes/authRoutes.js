const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  sendOtp,
  verifyOtp,
  updateProfile,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.put("/update-profile", authMiddleware, updateProfile);

module.exports = router;