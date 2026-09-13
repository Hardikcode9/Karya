const express = require("express");
const router = express.Router();

const { getWorkerEarnings } = require("../controllers/earningController");
const authMiddleware = require("../middleware/authMiddleware");

// All routes require authentication
router.use(authMiddleware);

// Worker routes
router.get("/worker", getWorkerEarnings);

module.exports = router;
