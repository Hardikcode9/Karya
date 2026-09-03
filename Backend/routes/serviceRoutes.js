const express = require("express");
const { getServices } = require("../controllers/serviceController");

const router = express.Router();

// GET /api/services
router.get("/", getServices);

module.exports = router;