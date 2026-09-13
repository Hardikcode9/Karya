const express = require("express");

const {
  createRating,
  getWorkerRatings,
  createDirectRating,
  getCustomerRatings,
} = require("../controllers/ratingController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createRating);
router.post("/direct", authMiddleware, createDirectRating);
router.get("/worker/:workerId", getWorkerRatings);
router.get("/customer", authMiddleware, getCustomerRatings);

module.exports = router;