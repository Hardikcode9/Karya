const Rating = require("../models/Rating");
const Booking = require("../models/Booking");
const WorkerProfile = require("../models/WorkerProfile");

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

module.exports = {
  createRating,
};