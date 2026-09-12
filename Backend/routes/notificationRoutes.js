const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notificationController");

// Get all notifications for user
router.get("/", authMiddleware, getNotifications);

// Mark all as read
router.patch("/read-all", authMiddleware, markAllAsRead);

// Mark specific notification as read
router.patch("/:id/read", authMiddleware, markAsRead);

module.exports = router;
