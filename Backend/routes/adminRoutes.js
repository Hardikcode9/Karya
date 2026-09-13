const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  getDashboard,
  getAdminWorkers,
  getAdminSHGs,
  getAdminCustomers,
  getAdminSales,
  getAdminTransactions,
} = require("../controllers/adminController");

// All admin routes require authentication
router.use(authMiddleware);

router.get("/dashboard", getDashboard);
router.get("/workers", getAdminWorkers);
router.get("/shgs", getAdminSHGs);
router.get("/customers", getAdminCustomers);
router.get("/sales", getAdminSales);
router.get("/transactions", getAdminTransactions);

module.exports = router;
