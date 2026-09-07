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

router.post("/profile", authMiddleware, createWorkerProfile);

router.patch("/availability", authMiddleware, updateWorkerAvailability);

// GET /api/workers/nearby
router.get("/nearby", authMiddleware, getNearbyWorkers);

// GET /api/workers
router.get("/", authMiddleware, getWorkers);

// GET /api/workers/:id 
router.get("/:id", authMiddleware, getWorkerById);

module.exports = router;
