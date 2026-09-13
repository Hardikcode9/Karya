const express = require("express");

const {
  createSHGProfile,
  getSHGProfile,
  getSHGDashboard,
  getSHGMembers,
  addMember,
  removeMember,
  getSHGJobs,
  assignMembersToJob,
  getSHGOrders,
  getSHGProducts,
  getSHGEarnings,
  getSHGReviews,
  getAllSHGs,
  getSHGById,
} = require("../controllers/shgcontroller");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes for browsing SHGs
router.get("/all", getAllSHGs);
router.get("/view/:id", getSHGById);

// Protected routes
router.post("/profile", authMiddleware, createSHGProfile);
router.get("/profile", authMiddleware, getSHGProfile);
router.get("/dashboard", authMiddleware, getSHGDashboard);
router.get("/members", authMiddleware, getSHGMembers);
router.post("/members", authMiddleware, addMember);
router.delete("/members/:workerId", authMiddleware, removeMember);
router.get("/jobs", authMiddleware, getSHGJobs);
router.post("/jobs/:bookingId/assign", authMiddleware, assignMembersToJob);
router.get("/orders", authMiddleware, getSHGOrders);
router.get("/products", authMiddleware, getSHGProducts);
router.get("/earnings", authMiddleware, getSHGEarnings);
router.get("/reviews", authMiddleware, getSHGReviews);

module.exports = router;