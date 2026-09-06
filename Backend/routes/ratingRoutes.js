const express = require("express");

const {
  createRating,
} = require("../controllers/ratingController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createRating);

module.exports = router;