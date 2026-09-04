const express = require("express");

const {
  getWorkers,
  getNearbyWorkers,
  getWorkerById,
} = require("../controllers/workerController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/workers/nearby
router.get("/nearby", authMiddleware, getNearbyWorkers);

// GET /api/workers
router.get("/", authMiddleware, getWorkers);

// GET /api/workers/:id 
router.get("/:id", authMiddleware, getWorkerById);

module.exports = router;
