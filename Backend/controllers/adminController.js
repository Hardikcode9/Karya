const User = require("../models/User");
const WorkerProfile = require("../models/WorkerProfile");
const SHGProfile = require("../models/SHGProfile");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const Product = require("../models/Product");
const Rating = require("../models/Rating");
const Service = require("../models/Service");

// Admin dashboard summary stats
exports.getDashboard = async (req, res) => {
  try {
    const [
      totalWorkers,
      totalSHGs,
      totalCustomers,
      totalBookings,
      totalServices,
      totalProducts,
      pendingBookings,
      activeBookings,
      completedBookings,
      cancelledBookings,
    ] = await Promise.all([
      User.countDocuments({ role: "worker" }),
      SHGProfile.countDocuments(),
      User.countDocuments({ role: "customer" }),
      Booking.countDocuments(),
      Service.countDocuments(),
      Product.countDocuments(),
      Booking.countDocuments({ status: "pending" }),
      Booking.countDocuments({ status: { $in: ["accepted", "in_progress"] } }),
      Booking.countDocuments({ status: "completed" }),
      Booking.countDocuments({ status: "cancelled" }),
    ]);

    // Total revenue
    const revenueResult = await Payment.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Monthly revenue (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Payment.aggregate([
      { $match: { status: "paid", createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          revenue: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Recent bookings
    const recentBookings = await Booking.find()
      .populate("customer", "name email phone")
      .populate("service", "name category")
      .populate({
        path: "worker",
        populate: { path: "user", select: "name phone" },
      })
      .sort({ createdAt: -1 })
      .limit(10);

    // Average rating
    const ratingResult = await Rating.aggregate([
      { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalWorkers,
          totalSHGs,
          totalCustomers,
          totalBookings,
          totalServices,
          totalProducts,
          totalRevenue,
          averageRating: ratingResult.length > 0 ? Number(ratingResult[0].avg.toFixed(1)) : 0,
          totalReviews: ratingResult.length > 0 ? ratingResult[0].count : 0,
        },
        bookings: {
          pending: pendingBookings,
          active: activeBookings,
          completed: completedBookings,
          cancelled: cancelledBookings,
        },
        monthlyRevenue,
        recentBookings,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all workers for admin
exports.getAdminWorkers = async (req, res) => {
  try {
    const { state, district, page = 1, limit = 50 } = req.query;

    const workerUsers = await User.find({ role: "worker" }).select("_id");
    const workerUserIds = workerUsers.map((u) => u._id);

    const filter = { user: { $in: workerUserIds } };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await WorkerProfile.countDocuments(filter);

    const workers = await WorkerProfile.find(filter)
      .populate("user", "name email phone isVerified village district state avatar")
      .populate("service", "name category")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Apply geographic filters on populated data
    let filtered = workers;
    if (state) {
      filtered = filtered.filter(
        (w) => w.user && w.user.state && w.user.state.toLowerCase().includes(state.toLowerCase())
      );
    }
    if (district) {
      filtered = filtered.filter(
        (w) => w.user && w.user.district && w.user.district.toLowerCase().includes(district.toLowerCase())
      );
    }

    res.status(200).json({
      success: true,
      count: filtered.length,
      total,
      data: filtered,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all SHGs for admin
exports.getAdminSHGs = async (req, res) => {
  try {
    const { state, district, status, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (state) filter.state = { $regex: state, $options: "i" };
    if (district) filter.district = { $regex: district, $options: "i" };
    if (status) filter.verificationStatus = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await SHGProfile.countDocuments(filter);

    const shgs = await SHGProfile.find(filter)
      .populate("user", "name email phone")
      .populate("services", "name category")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: shgs.length,
      total,
      data: shgs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all customers for admin
exports.getAdminCustomers = async (req, res) => {
  try {
    const { state, page = 1, limit = 50 } = req.query;
    const filter = { role: "customer" };

    if (state) filter.state = { $regex: state, $options: "i" };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(filter);

    const customers = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Enrich with booking counts and spending
    const enriched = await Promise.all(
      customers.map(async (customer) => {
        const bookingCount = await Booking.countDocuments({ customer: customer._id });
        const spentResult = await Payment.aggregate([
          { $match: { customer: customer._id, status: "paid" } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);
        const totalSpent = spentResult.length > 0 ? spentResult[0].total : 0;

        return {
          ...customer.toObject(),
          bookingCount,
          totalSpent,
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

// Sales analytics for admin
exports.getAdminSales = async (req, res) => {
  try {
    // Revenue by service category
    const revenueByService = await Payment.aggregate([
      { $match: { status: "paid" } },
      {
        $lookup: {
          from: "bookings",
          localField: "booking",
          foreignField: "_id",
          as: "bookingData",
        },
      },
      { $unwind: "$bookingData" },
      {
        $lookup: {
          from: "services",
          localField: "bookingData.service",
          foreignField: "_id",
          as: "serviceData",
        },
      },
      { $unwind: "$serviceData" },
      {
        $group: {
          _id: "$serviceData.category",
          revenue: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    // Monthly bookings trend (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const bookingsTrend = await Booking.aggregate([
      { $match: { createdAt: { $gte: twelveMonthsAgo } } },
      {
        $group: {
          _id: {
            month: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            status: "$status",
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);

    // Top workers by earnings
    const topWorkers = await Payment.aggregate([
      { $match: { status: "paid", worker: { $ne: null } } },
      {
        $group: {
          _id: "$worker",
          totalEarnings: { $sum: "$amount" },
          jobCount: { $sum: 1 },
        },
      },
      { $sort: { totalEarnings: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "workerprofiles",
          localField: "_id",
          foreignField: "_id",
          as: "profile",
        },
      },
      { $unwind: "$profile" },
      {
        $lookup: {
          from: "users",
          localField: "profile.user",
          foreignField: "_id",
          as: "userData",
        },
      },
      { $unwind: "$userData" },
      {
        $project: {
          name: "$userData.name",
          phone: "$userData.phone",
          totalEarnings: 1,
          jobCount: 1,
          rating: "$profile.rating",
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        revenueByService,
        bookingsTrend,
        topWorkers,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all transactions for admin
exports.getAdminTransactions = async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Payment.countDocuments(filter);

    const payments = await Payment.find(filter)
      .populate("customer", "name email phone state district village")
      .populate({
        path: "worker",
        populate: { path: "user", select: "name state district village" },
      })
      .populate({
        path: "booking",
        populate: { path: "service", select: "name category" },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: payments.length,
      total,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
