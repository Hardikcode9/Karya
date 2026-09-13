const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  createSuggestion,
  getSuggestions,
  updateSuggestion,
} = require("../controllers/suggestionController");

router.post("/", authMiddleware, createSuggestion);
router.get("/", authMiddleware, getSuggestions);
router.patch("/:id", authMiddleware, updateSuggestion);

module.exports = router;
