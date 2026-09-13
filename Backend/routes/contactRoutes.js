const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  submitContact,
  getContactMessages,
  updateContactStatus,
} = require("../controllers/contactController");

// Public
router.post("/", submitContact);

// Admin
router.get("/", authMiddleware, getContactMessages);
router.patch("/:id/status", authMiddleware, updateContactStatus);

module.exports = router;
