const express = require("express");

const {
  getWorkers,
  getNearbyWorkers,
  getWorkerById,
  createWorkerProfile,
  updateWorkerAvailability,
  getWorkerProfile,
} = require("../controllers/workerController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public browsing routes
router.get("/nearby", getNearbyWorkers);
router.get("/", getWorkers);
// Protected routes
router.get("/me", authMiddleware, getWorkerProfile);
router.post("/profile", authMiddleware, createWorkerProfile);
router.patch("/availability", authMiddleware, updateWorkerAvailability);

router.get("/:id", getWorkerById);

module.exports = router;
