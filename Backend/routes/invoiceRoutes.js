const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  createInvoice,
  getCustomerInvoice,
} = require("../controllers/invoiceController");

router.post("/", authMiddleware, createInvoice);

router.get("/:id", authMiddleware, getCustomerInvoice);

module.exports = router;