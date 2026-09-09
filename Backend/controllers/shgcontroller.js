const mongoose = require("mongoose");

const SHGProfile = require("../models/SHGProfile");
const WorkerProfile = require("../models/WorkerProfile");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const Rating = require("../models/Rating");

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