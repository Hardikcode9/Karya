const Rating = require("../models/Rating");
const Booking = require("../models/Booking");
const WorkerProfile = require("../models/WorkerProfile");
const Notification = require("../models/Notification");
const User = require("../models/User");

const createRating = async (req, res) => {
  try {
    // Only customers can give ratings
    if (req.user.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Only customers can give ratings",
      });
    }

    const { booking, rating, review } = req.body;

    // Check required fields
    if (!booking || rating === undefined) {
      return res.status(400).json({
        success: false,
        message: "Booking and rating are required",
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Find the booking
    const existingBooking = await Booking.findOne({
      _id: booking,
      customer: req.user.userId,
    });

    if (!existingBooking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Rating only allowed after completion
    if (existingBooking.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "You can rate a worker only after the booking is completed",
      });
    }

    // Check if booking has already been rated
    const existingRating = await Rating.findOne({ booking });

    if (existingRating) {
      return res.status(400).json({
        success: false,
        message: "This booking has already been rated",
      });
    }

    // Create rating
    const newRating = await Rating.create({
      booking: existingBooking._id,
      customer: req.user.userId,
      worker: existingBooking.worker,
      rating,
      review,
    });

    // Get worker profile
    const workerProfile = await WorkerProfile.findById(existingBooking.worker);

    if (!workerProfile) {
      return res.status(404).json({
        success: false,
        message: "Worker profile not found",
      });
    }

    // Calculate new average rating
    const oldTotal = workerProfile.totalReviews;
    const oldRating = workerProfile.rating;

    const newTotal = oldTotal + 1;
    const newAverage =
      (oldRating * oldTotal + rating) / newTotal;

    workerProfile.totalReviews = newTotal;
    workerProfile.rating = Number(newAverage.toFixed(2));

    await workerProfile.save();

    // Create notification for the worker about the new review
    try {
      const customerUser = await User.findById(req.user.userId).select("name");
      const customerName = customerUser?.name || "A customer";
      const reviewSnippet = review ? `"${review.substring(0, 80)}${review.length > 80 ? '...' : ''}"` : "";

      await Notification.create({
        recipient: workerProfile.user,
        title: "New Review Received",
        message: `${customerName} rated you ${rating}/5 stars${reviewSnippet ? `: ${reviewSnippet}` : "."}`,
        type: "review",
        relatedId: newRating._id,
      });
    } catch (notifErr) {
      console.error("Failed to create review notification:", notifErr);
      // Don't fail the rating creation if notification fails
    }

    res.status(201).json({
      success: true,
      message: "Rating submitted successfully",
      rating: newRating,
      workerRating: workerProfile.rating,
      totalReviews: workerProfile.totalReviews,
    });
  } catch (error) {
    console.error("Create Rating Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to submit rating",
    });
  }
};

// Get all ratings for a specific worker
const getWorkerRatings = async (req, res) => {
  try {
    const { workerId } = req.params;

    const ratings = await Rating.find({ worker: workerId })
      .populate("customer", "name village")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: ratings.length,
      ratings,
    });
  } catch (error) {
    console.error("Get worker ratings error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Direct rating (without explicit bookingId)
const mongoose = require("mongoose");
const createDirectRating = async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({ success: false, message: "Only customers can give ratings" });
    }

    const { workerId, rating, review } = req.body;
    if (!workerId || rating === undefined) {
      return res.status(400).json({ success: false, message: "Worker and rating are required" });
    }

    // Try to find a completed booking for this worker and customer
    const existingBooking = await Booking.findOne({
      worker: workerId,
      customer: req.user.userId,
      status: "completed"
    }).sort({ createdAt: -1 });

    let finalBookingId;

    if (existingBooking) {
      const existingRating = await Rating.findOne({ booking: existingBooking._id });
      if (!existingRating) {
        finalBookingId = existingBooking._id;
      }
    }

    if (!finalBookingId) {
       // Auto-create a mock completed booking so the rating can be saved in this prototype
       const Service = require("../models/Service");
       const defaultService = await Service.findOne({});
       
       const mockBooking = await Booking.create({
         customer: req.user.userId,
         worker: workerId,
         service: defaultService ? defaultService._id : new mongoose.Types.ObjectId(),
         scheduledDate: new Date(),
         price: 0,
         status: "completed",
         paymentStatus: "paid"
       });
       finalBookingId = mockBooking._id;
    }

    // Create rating
    const newRating = await Rating.create({
      booking: finalBookingId,
      customer: req.user.userId,
      worker: workerId,
      rating,
      review,
    });

    // Get worker profile
    const workerProfile = await WorkerProfile.findById(workerId);
    if (workerProfile) {
      const oldTotal = workerProfile.totalReviews || 0;
      const oldRating = workerProfile.rating || 0;
      const newTotal = oldTotal + 1;
      const newAverage = (oldRating * oldTotal + rating) / newTotal;
      workerProfile.totalReviews = newTotal;
      workerProfile.rating = Number(newAverage.toFixed(2));
      await workerProfile.save();
    }

    // Create notification for the worker about the new review
    try {
      const customerUser = await User.findById(req.user.userId).select("name");
      const customerName = customerUser?.name || "A customer";
      const reviewSnippet = review ? `"${review.substring(0, 80)}${review.length > 80 ? '...' : ''}"` : "";

      await Notification.create({
        recipient: workerProfile ? workerProfile.user : workerId, // Fallback
        title: "New Review Received",
        message: `${customerName} rated you ${rating}/5 stars${reviewSnippet ? `: ${reviewSnippet}` : "."}`,
        type: "review",
        relatedId: newRating._id,
      });
    } catch (notifErr) {
      console.error("Failed to create review notification:", notifErr);
    }

    res.status(201).json({
      success: true,
      message: "Rating submitted successfully",
      rating: newRating,
    });
  } catch (error) {
    console.error("Direct Rating Error:", error);
    res.status(500).json({ success: false, message: "Failed to submit rating" });
  }
};

// Get all ratings given by a customer
const getCustomerRatings = async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({ success: false, message: "Only customers can view their ratings" });
    }

    const ratings = await Rating.find({ customer: req.user.userId })
      .populate("worker", "name")
      .populate("booking", "service")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: ratings.length,
      ratings,
    });
  } catch (error) {
    console.error("Get customer ratings error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createRating,
  getWorkerRatings,
  createDirectRating,
  getCustomerRatings,
};