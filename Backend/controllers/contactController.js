const ContactMessage = require("../models/ContactMessage");

// Submit contact form (public)
exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, subject, and message are required",
      });
    }

    const contact = await ContactMessage.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Your message has been sent successfully",
      data: contact,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all contact messages (admin)
exports.getContactMessages = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await ContactMessage.countDocuments(filter);

    const messages = await ContactMessage.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: messages.length,
      total,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update contact message status (admin)
exports.updateContactStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true, runValidators: true }
    );

    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: message,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
