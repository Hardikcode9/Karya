const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  createCommission,
} = require("../controllers/commissionController");

router.post("/", authMiddleware, createCommission);

module.exports = router;