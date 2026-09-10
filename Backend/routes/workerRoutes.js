const express = require("express");

const {
  getWorkers,
  getNearbyWorkers,
  getWorkerById,
  createWorkerProfile,
  updateWorkerAvailability,
} = require("../controllers/workerController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public browsing routes
router.get("/nearby", getNearbyWorkers);
router.get("/", getWorkers);
router.get("/:id", getWorkerById);

// Protected routes
router.post("/profile", authMiddleware, createWorkerProfile);
router.patch("/availability", authMiddleware, updateWorkerAvailability);

module.exports = router;
