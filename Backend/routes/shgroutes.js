const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const shgController = require("../controllers/shgcontroller");

router.post("/", authMiddleware, shgController.createSHGProfile);

module.exports = router;
