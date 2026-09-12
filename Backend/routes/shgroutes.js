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
} = require("../controllers/shgcontroller");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/profile", authMiddleware, createSHGProfile);
router.get("/profile", authMiddleware, getSHGProfile);
router.get("/dashboard", authMiddleware, getSHGDashboard);
router.get("/members", authMiddleware, getSHGMembers);
router.post("/members", authMiddleware, addMember);
router.delete("/members/:workerId", authMiddleware, removeMember);
router.get("/jobs", authMiddleware, getSHGJobs);
router.post("/jobs/:bookingId/assign", authMiddleware, assignMembersToJob);

module.exports = router;