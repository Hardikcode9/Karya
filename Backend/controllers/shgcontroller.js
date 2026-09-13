const mongoose = require("mongoose");

const SHGProfile = require("../models/SHGProfile");
const WorkerProfile = require("../models/WorkerProfile");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const Rating = require("../models/Rating");
const Product = require("../models/Product");

// ==========================================
// CREATE SHG PROFILE
// ==========================================

exports.createSHGProfile = async (req, res) => {
  try {
    if (req.user.role !== "shg") {
      return res.status(403).json({
        success: false,
        message: "Only SHG users can create an SHG profile",
      });
    }

    const {
      shgName,
      registrationId,
      village,
      district,
      state,
      contactNumber,
      email,
      establishedDate,
      services,
    } = req.body;

    if (
      !shgName ||
      !registrationId ||
      !village ||
      !district ||
      !state
    ) {
      return res.status(400).json({
        success: false,
        message: "Required SHG fields are missing",
      });
    }

    const existingSHG = await SHGProfile.findOne({
      $or: [
        { user: req.user.userId },
        { registrationId },
      ],
    });

    if (existingSHG) {
      return res.status(409).json({
        success: false,
        message: "SHG profile already exists",
      });
    }

    const shg = await SHGProfile.create({
      user: req.user.userId,
      shgName,
      registrationId,
      village,
      district,
      state,
      contactNumber,
      email,
      establishedDate,
      services: services || [],
    });

    res.status(201).json({
      success: true,
      message: "SHG profile created successfully",
      data: shg,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET SHG PROFILE
// ==========================================

exports.getSHGProfile = async (req, res) => {
  try {
    const shg = await SHGProfile.findOne({
      user: req.user.userId,
    })
      .populate("user", "name email phone")
      .populate("services", "name category")
      .populate({
        path: "members.worker",
        populate: {
          path: "user",
          select: "name email phone",
        },
      });

    if (!shg) {
      return res.status(404).json({
        success: false,
        message: "SHG profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: shg,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// SHG DASHBOARD
// ==========================================

exports.getSHGDashboard = async (req, res) => {
  try {
    const shg = await SHGProfile.findOne({
      user: req.user.userId,
    });

    if (!shg) {
      return res.status(404).json({
        success: false,
        message: "SHG profile not found",
      });
    }

    const shgId = shg._id;

    // -----------------------------
    // MEMBER STATISTICS
    // -----------------------------

    const totalMembers = shg.members.length;

    const activeMembers = shg.members.filter(
      (member) => member.isActive
    ).length;


    // -----------------------------
    // JOB STATISTICS
    // -----------------------------

    const totalJobs = await Booking.countDocuments({
      shg: shgId,
    });

    const pendingJobs = await Booking.countDocuments({
      shg: shgId,
      status: "pending",
    });

    const activeJobs = await Booking.countDocuments({
      shg: shgId,
      status: {
        $in: ["accepted", "in_progress"],
      },
    });

    const completedJobs = await Booking.countDocuments({
      shg: shgId,
      status: "completed",
    });

    const cancelledJobs = await Booking.countDocuments({
      shg: shgId,
      status: "cancelled",
    });


    // -----------------------------
    // EARNINGS
    // -----------------------------

    const earningsResult = await Payment.aggregate([
      {
        $match: {
          status: "paid",
        },
      },
      {
        $lookup: {
          from: "bookings",
          localField: "booking",
          foreignField: "_id",
          as: "bookingData",
        },
      },
      {
        $unwind: "$bookingData",
      },
      {
        $match: {
          "bookingData.shg": shgId,
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const totalEarnings =
      earningsResult.length > 0
        ? earningsResult[0].total
        : 0;


    // -----------------------------
    // PERFORMANCE
    // -----------------------------

    const completionRate =
      totalJobs > 0
        ? Number(((completedJobs / totalJobs) * 100).toFixed(2))
        : 0;

    const cancellationRate =
      totalJobs > 0
        ? Number(((cancelledJobs / totalJobs) * 100).toFixed(2))
        : 0;


    res.status(200).json({
      success: true,

      data: {
        shg: {
          id: shg._id,
          name: shg.shgName,
          registrationId: shg.registrationId,
          verificationStatus: shg.verificationStatus,
          rating: shg.rating,
          totalReviews: shg.totalReviews,
        },

        overview: {
          totalMembers,
          activeMembers,
          totalJobs,
          pendingJobs,
          activeJobs,
          completedJobs,
          cancelledJobs,
          totalEarnings,
        },

        performance: {
          completionRate,
          cancellationRate,
          rating: shg.rating,
        },
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET SHG MEMBERS
// ==========================================

exports.getSHGMembers = async (req, res) => {
  try {
    const shg = await SHGProfile.findOne({
      user: req.user.userId,
    }).populate({
      path: "members.worker",
      populate: {
        path: "user",
        select: "name email phone",
      },
    });

    if (!shg) {
      return res.status(404).json({
        success: false,
        message: "SHG profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: shg.members,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// ADD MEMBER
// ==========================================

exports.addMember = async (req, res) => {
  try {
    const { workerId, memberRole } = req.body;

    if (!workerId) {
      return res.status(400).json({
        success: false,
        message: "Worker ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(workerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid worker ID",
      });
    }

    const shg = await SHGProfile.findOne({
      user: req.user.userId,
    });

    if (!shg) {
      return res.status(404).json({
        success: false,
        message: "SHG profile not found",
      });
    }

    const worker = await WorkerProfile.findById(workerId);

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    const alreadyMember = shg.members.some(
      (member) =>
        member.worker.toString() === workerId
    );

    if (alreadyMember) {
      return res.status(409).json({
        success: false,
        message: "Worker is already an SHG member",
      });
    }

    shg.members.push({
      worker: workerId,
      memberRole: memberRole || "member",
    });

    await shg.save();

    res.status(201).json({
      success: true,
      message: "Member added successfully",
      data: shg.members,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// REMOVE MEMBER
// ==========================================

exports.removeMember = async (req, res) => {
  try {
    const { workerId } = req.params;

    const shg = await SHGProfile.findOne({
      user: req.user.userId,
    });

    if (!shg) {
      return res.status(404).json({
        success: false,
        message: "SHG profile not found",
      });
    }

    const member = shg.members.find(
      (member) =>
        member.worker.toString() === workerId
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    member.isActive = false;

    await shg.save();

    res.status(200).json({
      success: true,
      message: "Member deactivated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET SHG JOBS
// ==========================================

exports.getSHGJobs = async (req, res) => {
  try {
    const shg = await SHGProfile.findOne({
      user: req.user.userId,
    });

    if (!shg) {
      return res.status(404).json({
        success: false,
        message: "SHG profile not found",
      });
    }

    const jobs = await Booking.find({
      shg: shg._id,
    })
      .populate("customer", "name phone email")
      .populate("service", "name category")
      .populate({
        path: "assignedWorkers",
        populate: {
          path: "user",
          select: "name phone",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// ASSIGN MEMBERS TO JOB
// ==========================================

exports.assignMembersToJob = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { workerIds } = req.body;

    if (!Array.isArray(workerIds) || workerIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "workerIds must be a non-empty array",
      });
    }

    const shg = await SHGProfile.findOne({
      user: req.user.userId,
    });

    if (!shg) {
      return res.status(404).json({
        success: false,
        message: "SHG profile not found",
      });
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      shg: shg._id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "SHG booking not found",
      });
    }

    // Check that workers belong to this SHG
    const shgWorkerIds = shg.members
      .filter((member) => member.isActive)
      .map((member) => member.worker.toString());

    const invalidWorkers = workerIds.filter(
      (workerId) =>
        !shgWorkerIds.includes(workerId)
    );

    if (invalidWorkers.length > 0) {
      return res.status(403).json({
        success: false,
        message:
          "One or more workers do not belong to this SHG",
      });
    }

    booking.assignedWorkers = workerIds;

    if (booking.status === "pending") {
      booking.status = "accepted";
    }

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Members assigned successfully",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET SHG ORDERS (for dashboard)
// ==========================================

exports.getSHGOrders = async (req, res) => {
  try {
    const shg = await SHGProfile.findOne({ user: req.user.userId });
    if (!shg) {
      return res.status(404).json({ success: false, message: "SHG profile not found" });
    }

    const { status } = req.query;
    const filter = { shg: shg._id };
    if (status) filter.status = status;

    const orders = await Booking.find(filter)
      .populate("customer", "name phone email address")
      .populate("service", "name category")
      .populate({
        path: "assignedWorkers",
        populate: { path: "user", select: "name phone" },
      })
      .sort({ createdAt: -1 });

    // Enrich orders with payment info
    const enriched = await Promise.all(
      orders.map(async (order) => {
        const payment = await Payment.findOne({ booking: order._id });
        return {
          ...order.toObject(),
          payment: payment
            ? {
                status: payment.status,
                transactionId: payment.transactionId,
                paymentMethod: payment.paymentMethod,
                amount: payment.amount,
              }
            : null,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: enriched.length,
      data: enriched,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ==========================================
// GET SHG PRODUCTS (for dashboard)
// ==========================================

exports.getSHGProducts = async (req, res) => {
  try {
    const shg = await SHGProfile.findOne({ user: req.user.userId });
    if (!shg) {
      return res.status(404).json({ success: false, message: "SHG profile not found" });
    }

    const products = await Product.find({ shg: shg._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ==========================================
// GET SHG EARNINGS (for dashboard)
// ==========================================

exports.getSHGEarnings = async (req, res) => {
  try {
    const shg = await SHGProfile.findOne({ user: req.user.userId });
    if (!shg) {
      return res.status(404).json({ success: false, message: "SHG profile not found" });
    }

    // Get all payments for SHG bookings
    const payments = await Payment.find({ status: "paid" })
      .populate({
        path: "booking",
        match: { shg: shg._id },
        select: "service scheduledDate status",
        populate: { path: "service", select: "name category" },
      })
      .sort({ createdAt: -1 });

    // Filter out payments where booking didn't match (null after populate match)
    const shgPayments = payments.filter((p) => p.booking !== null);

    // Calculate totals
    const totalEarnings = shgPayments.reduce((sum, p) => sum + p.amount, 0);

    // Monthly breakdown
    const monthlyMap = {};
    shgPayments.forEach((p) => {
      const month = p.createdAt.toISOString().slice(0, 7);
      if (!monthlyMap[month]) monthlyMap[month] = { revenue: 0, count: 0 };
      monthlyMap[month].revenue += p.amount;
      monthlyMap[month].count += 1;
    });

    const monthlyBreakdown = Object.entries(monthlyMap)
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => b.month.localeCompare(a.month));

    res.status(200).json({
      success: true,
      data: {
        totalEarnings,
        transactionCount: shgPayments.length,
        transactions: shgPayments.map((p) => ({
          _id: p._id,
          amount: p.amount,
          paymentMethod: p.paymentMethod,
          transactionId: p.transactionId,
          status: p.status,
          booking: p.booking,
          createdAt: p.createdAt,
        })),
        monthlyBreakdown,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ==========================================
// GET SHG REVIEWS (for dashboard)
// ==========================================

exports.getSHGReviews = async (req, res) => {
  try {
    const shg = await SHGProfile.findOne({ user: req.user.userId });
    if (!shg) {
      return res.status(404).json({ success: false, message: "SHG profile not found" });
    }

    // Get reviews for bookings belonging to this SHG
    const shgBookings = await Booking.find({ shg: shg._id }).select("_id");
    const bookingIds = shgBookings.map((b) => b._id);

    const reviews = await Rating.find({ booking: { $in: bookingIds } })
      .populate("customer", "name email avatar")
      .populate({
        path: "booking",
        select: "service",
        populate: { path: "service", select: "name category" },
      })
      .sort({ createdAt: -1 });

    // Calculate average
    const avgRating =
      reviews.length > 0
        ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1))
        : 0;

    res.status(200).json({
      success: true,
      data: {
        averageRating: avgRating,
        totalReviews: reviews.length,
        reviews,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ==========================================
// GET ALL SHGS (public browsing)
// ==========================================

exports.getAllSHGs = async (req, res) => {
  try {
    const { state, district, page = 1, limit = 20 } = req.query;
    const filter = { isActive: true };

    if (state) filter.state = { $regex: state, $options: "i" };
    if (district) filter.district = { $regex: district, $options: "i" };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await SHGProfile.countDocuments(filter);

    const shgs = await SHGProfile.find(filter)
      .populate("user", "name email phone")
      .populate("services", "name category")
      .sort({ rating: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Enrich with product count
    const enriched = await Promise.all(
      shgs.map(async (shg) => {
        const productCount = await Product.countDocuments({ shg: shg._id, isActive: true });
        return {
          ...shg.toObject(),
          productCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: enriched.length,
      total,
      data: enriched,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ==========================================
// GET SINGLE SHG BY ID (public)
// ==========================================

exports.getSHGById = async (req, res) => {
  try {
    const shg = await SHGProfile.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("services", "name category")
      .populate({
        path: "members.worker",
        populate: { path: "user", select: "name email phone" },
      });

    if (!shg) {
      return res.status(404).json({ success: false, message: "SHG not found" });
    }

    // Get products
    const products = await Product.find({ shg: shg._id, isActive: true });

    // Get reviews
    const shgBookings = await Booking.find({ shg: shg._id }).select("_id");
    const bookingIds = shgBookings.map((b) => b._id);
    const reviews = await Rating.find({ booking: { $in: bookingIds } })
      .populate("customer", "name avatar")
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        ...shg.toObject(),
        products,
        reviews,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};