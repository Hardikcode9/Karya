const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  createQuery,
  getQueries,
  updateQuery,
} = require("../controllers/queryController");

router.post("/", authMiddleware, createQuery);
router.get("/", authMiddleware, getQueries);
router.patch("/:id", authMiddleware, updateQuery);

module.exports = router;
