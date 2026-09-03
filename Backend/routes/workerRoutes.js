const express = require("express");
const { getWorkers } = require("../controllers/workerController");

const router = express.Router();

// GET /api/workers
router.get("/", getWorkers);

module.exports = router;