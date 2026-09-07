const mongoose = require("mongoose");

const Booking = require("../models/Booking");
const WorkerProfile = require("../models/WorkerProfile");

const createBooking = async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Only customers can create bookings",
      });
    }
    const {
  worker,
  service,
  scheduledDate,
  duration,
  address,
  notes,
} = req.body;

    // Basic validation
    if (!worker || !service || !scheduledDate || !duration || !address) {
      return res.status(400).json({
        success: false,
        message: "Worker, service, scheduled date, duration and address are required",
      });
    }

    if (!Number.isFinite(Number(duration))) {
      return res.status(400).json({
        success: false,
        message: "Duration must be a valid number",
      });
    }

    if (Number(duration) < 15) {
      return res.status(400).json({
        success: false,
        message: "Duration must be at least 15 minutes",
      });
    }

    const bookingDate = new Date(scheduledDate);

    if (Number.isNaN(bookingDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Scheduled date must be a valid date",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(worker) ||
      !mongoose.Types.ObjectId.isValid(service)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid worker or service ID",
      });
    }

    const workerProfile = await WorkerProfile.findOne({
      _id: worker,
      isAvailable: true,
    });

    if (!workerProfile) {
      return res.status(404).json({
        success: false,
        message: "Worker not found or unavailable",
      });
    }

    const dayNames = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const bookingDay = dayNames[bookingDate.getDay()];
const hours = workerProfile.workingHours?.[bookingDay];

if (!hours || !hours.start || !hours.end) {
  return res.status(400).json({
    success: false,
    message: "Worker is not available on this day",
  });
}

const bookingStartMinutes =
  bookingDate.getHours() * 60 + bookingDate.getMinutes();

const [startHour, startMinute] = hours.start.split(":").map(Number);
const [endHour, endMinute] = hours.end.split(":").map(Number);

const workingStartMinutes = startHour * 60 + startMinute;
const workingEndMinutes = endHour * 60 + endMinute;

const bookingEndMinutes =
  bookingStartMinutes + Number(duration);

if (
  bookingStartMinutes < workingStartMinutes ||
  bookingEndMinutes > workingEndMinutes
) {
  return res.status(400).json({
    success: false,
    message: "Booking time is outside worker working hours",
  });
}

    // Make sure selected service belongs to the worker
    if (workerProfile.service.toString() !== service) {
      return res.status(400).json({
        success: false,
        message: "Worker does not provide the selected service",
      });
    }

    const newBookingStart = bookingDate;
const newBookingEnd = new Date(
  bookingDate.getTime() + Number(duration) * 60 * 1000
);

const existingBooking = await Booking.findOne({
  worker,
  status: { $in: ["pending", "accepted", "in_progress"] },
  scheduledDate: { $lt: newBookingEnd },
  $expr: {
    $gt: [
      {
        $add: [
          { $toLong: "$scheduledDate" },
          { $multiply: ["$duration", 60 * 1000] },
        ],
      },
      newBookingStart.getTime(),
    ],
  },
});

if (existingBooking) {
  return res.status(409).json({
    success: false,
    message: "Worker is already booked during this time",
  });
}

    const booking = await Booking.create({
      customer: req.user.userId,
      worker,
      service,
      scheduledDate,
      duration,
      address,
      notes,
      price: workerProfile.pricePerService,
    });
    const populatedBooking = await Booking.findById(booking._id)
      .populate("customer", "name phone")
      .populate({
        path: "worker",
        populate: {
          path: "user",
          select: "name phone",
        },
      })
      .populate("service", "name category");

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    console.error("Create Booking Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create booking",
    });
  }
};

const getWorkerBookings = async (req, res) => {
  try {
    if (req.user.role !== "worker") {
      return res.status(403).json({
        success: false,
        message: "Only workers can access worker bookings",
      });
    }
    const workerProfile = await WorkerProfile.findOne({
      user: req.user.userId,
    });

    if (!workerProfile) {
      return res.status(404).json({
        success: false,
        message: "Worker profile not found",
      });
    }

    const bookings = await Booking.find({
      worker: workerProfile._id,
    })
      .populate("customer", "name phone")
      .populate("service", "name category")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get Worker Bookings Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch worker bookings",
    });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    if (req.user.role !== "worker") {
      return res.status(403).json({
        success: false,
        message: "Only workers can update booking status",
      });
    }
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "accepted",
      "rejected",
      "in_progress",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status",
      });
    }

    const workerProfile = await WorkerProfile.findOne({
      user: req.user.userId,
    });

    if (!workerProfile) {
      return res.status(404).json({
        success: false,
        message: "Worker profile not found",
      });
    }

    const booking = await Booking.findOne({
      _id: id,
      worker: workerProfile._id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Define valid status transitions
    const validTransitions = {
      pending: ["accepted", "rejected", "cancelled"],
      accepted: ["in_progress", "cancelled"],
      in_progress: ["completed", "cancelled"],
      completed: [],
      rejected: [],
      cancelled: [],
    };

    const currentStatus = booking.status;

    if (!validTransitions[currentStatus].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change booking status from ${currentStatus} to ${status}`,
      });
    }

    booking.status = status;

    await booking.save();

    res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
      booking,
    });
  } catch (error) {
    console.error("Update Booking Status Error:", error.message);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update booking status",
    });
  }
};

const getCustomerBookings = async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Only customers can access customer bookings",
      });
    }
    const bookings = await Booking.find({
      customer: req.user.userId,
    })
      .populate({
        path: "worker",
        populate: {
          path: "user",
          select: "name phone",
        },
      })
      .populate("service", "name category")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get Customer Bookings Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch customer bookings",
    });
  }
};

const cancelBooking = async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Only customers can cancel bookings",
      });
    }

    const { id } = req.params;

    const booking = await Booking.findOne({
      _id: id,
      customer: req.user.userId,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Customer can cancel only before work starts
    if (!["pending", "accepted"].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel booking with status ${booking.status}`,
      });
    }

    booking.status = "cancelled";

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error("Cancel Booking Error:", error.message);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
    });
  }
};

module.exports = {
  createBooking,
  getWorkerBookings,
  updateBookingStatus,
  getCustomerBookings,
  cancelBooking,
};
