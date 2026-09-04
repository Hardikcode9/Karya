const WorkerProfile = require("../models/WorkerProfile");

const getWorkers = async (req, res) => {
  try {
    const {
      service,
      skill,
      minExperience,
      minRating,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
    } = req.query;

    // Convert pagination values
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    // Validate pagination
    if (
      !Number.isInteger(pageNumber) ||
      pageNumber < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Page must be a positive integer",
      });
    }

    if (
      !Number.isInteger(limitNumber) ||
      limitNumber < 1 ||
      limitNumber > 50
    ) {
      return res.status(400).json({
        success: false,
        message: "Limit must be between 1 and 50",
      });
    }

    // Validate numeric query parameters
    const numericParams = {
      minExperience,
      minRating,
      minPrice,
      maxPrice,
    };

    for (const [key, value] of Object.entries(numericParams)) {
      if (value !== undefined) {
        const numberValue = Number(value);

        if (Number.isNaN(numberValue)) {
          return res.status(400).json({
            success: false,
            message: `${key} must be a valid number`,
          });
        }
      }
    }

    // Validate rating
    if (
      minRating !== undefined &&
      (Number(minRating) < 0 || Number(minRating) > 5)
    ) {
      return res.status(400).json({
        success: false,
        message: "minRating must be between 0 and 5",
      });
    }

    // Validate experience
    if (
      minExperience !== undefined &&
      Number(minExperience) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "minExperience cannot be negative",
      });
    }

    // Validate price
    if (
      minPrice !== undefined &&
      Number(minPrice) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "minPrice cannot be negative",
      });
    }

    if (
      maxPrice !== undefined &&
      Number(maxPrice) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "maxPrice cannot be negative",
      });
    }

    // Validate price range
    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      Number(minPrice) > Number(maxPrice)
    ) {
      return res.status(400).json({
        success: false,
        message: "minPrice cannot be greater than maxPrice",
      });
    }

    // Build filter
    const filter = {
      isAvailable: true,
    };

    if (service) {
      filter.service = service;
    }

    if (skill) {
      filter.skills = {
        $regex: skill,
        $options: "i",
      };
    }

    if (minExperience !== undefined) {
      filter.experience = {
        $gte: Number(minExperience),
      };
    }

    if (minRating !== undefined) {
      filter.rating = {
        $gte: Number(minRating),
      };
    }

    if (
      minPrice !== undefined ||
      maxPrice !== undefined
    ) {
      filter.pricePerService = {};

      if (minPrice !== undefined) {
        filter.pricePerService.$gte = Number(minPrice);
      }

      if (maxPrice !== undefined) {
        filter.pricePerService.$lte = Number(maxPrice);
      }
    }

    // Pagination
    const skip = (pageNumber - 1) * limitNumber;

    // Get total matching workers
    const totalWorkers = await WorkerProfile.countDocuments(filter);

    // Get paginated workers
    const workers = await WorkerProfile.find(filter)
      .populate("user", "name phone")
      .populate("service", "name category")
      .sort({ rating: -1 })
      .skip(skip)
      .limit(limitNumber);

    const totalPages = Math.ceil(
      totalWorkers / limitNumber
    );

    res.status(200).json({
      success: true,
      count: workers.length,
      pagination: {
        currentPage: pageNumber,
        limit: limitNumber,
        totalWorkers,
        totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPreviousPage: pageNumber > 1,
      },
      workers,
    });
  } catch (error) {
    console.error(
      "Get Workers Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch workers",
    });
  }
};

const getNearbyWorkers = async (req, res) => {
  try {
    const {
      latitude,
      longitude,
      radius = 10,
      service,
      skill,
      minExperience,
      minRating,
      minPrice,
      maxPrice,
    } = req.query;

    // Validate latitude and longitude
    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    const lat = Number(latitude);
    const lng = Number(longitude);
    const radiusInKm = Number(radius);

    // Validate numbers
    if (Number.isNaN(lat) || Number.isNaN(lng) || Number.isNaN(radiusInKm)) {
      return res.status(400).json({
        success: false,
        message: "Latitude, longitude and radius must be valid numbers",
      });
    }

    // Validate coordinate ranges
    if (lat < -90 || lat > 90) {
      return res.status(400).json({
        success: false,
        message: "Latitude must be between -90 and 90",
      });
    }

    if (lng < -180 || lng > 180) {
      // Validate additional numeric filters
      const numericParams = {
        minExperience,
        minRating,
        minPrice,
        maxPrice,
      };

      for (const [key, value] of Object.entries(numericParams)) {
        if (value !== undefined) {
          const numberValue = Number(value);

          if (Number.isNaN(numberValue)) {
            return res.status(400).json({
              success: false,
              message: `${key} must be a valid number`,
            });
          }
        }
      }

      // Validate rating
      if (
        minRating !== undefined &&
        (Number(minRating) < 0 || Number(minRating) > 5)
      ) {
        return res.status(400).json({
          success: false,
          message: "minRating must be between 0 and 5",
        });
      }

      // Validate experience
      if (minExperience !== undefined && Number(minExperience) < 0) {
        return res.status(400).json({
          success: false,
          message: "minExperience cannot be negative",
        });
      }

      // Validate prices
      if (minPrice !== undefined && Number(minPrice) < 0) {
        return res.status(400).json({
          success: false,
          message: "minPrice cannot be negative",
        });
      }

      if (maxPrice !== undefined && Number(maxPrice) < 0) {
        return res.status(400).json({
          success: false,
          message: "maxPrice cannot be negative",
        });
      }

      if (
        minPrice !== undefined &&
        maxPrice !== undefined &&
        Number(minPrice) > Number(maxPrice)
      ) {
        return res.status(400).json({
          success: false,
          message: "minPrice cannot be greater than maxPrice",
        });
      }

      return res.status(400).json({
        success: false,
        message: "Longitude must be between -180 and 180",
      });
    }

    if (radiusInKm <= 0) {
      return res.status(400).json({
        success: false,
        message: "Radius must be greater than 0",
      });
    }

    // Build filters
    const filter = {
      isAvailable: true,
    };

    if (service) {
      filter.service = service;
    }

    if (skill) {
      filter.skills = {
        $regex: skill,
        $options: "i",
      };
    }

    if (minExperience) {
      filter.experience = {
        $gte: Number(minExperience),
      };
    }

    if (minRating) {
      filter.rating = {
        $gte: Number(minRating),
      };
    }

    if (minPrice || maxPrice) {
      filter.pricePerService = {};

      if (minPrice) {
        filter.pricePerService.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.pricePerService.$lte = Number(maxPrice);
      }
    }

    // Convert km to meters
    const radiusInMeters = radiusInKm * 1000;

    // Geo-spatial aggregation
    const workers = await WorkerProfile.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [lng, lat],
          },
          key: "location",
          distanceField: "distanceInMeters",
          maxDistance: radiusInMeters,
          spherical: true,
          query: filter,
        },
      },

      // Convert distance and calculate matching score
      {
        $addFields: {
          distanceInKm: {
            $round: [
              {
                $divide: ["$distanceInMeters", 1000],
              },
              2,
            ],
          },

          // Rating score: 0 - 40
          ratingScore: {
            $multiply: [
              {
                $divide: ["$rating", 5],
              },
              40,
            ],
          },

          // Experience score: maximum 20
          experienceScore: {
            $multiply: [
              {
                $divide: [
                  {
                    $min: ["$experience", 10],
                  },
                  10,
                ],
              },
              20,
            ],
          },

          // Distance score: maximum 30
          // Closer workers receive a higher score
          distanceScore: {
            $multiply: [
              {
                $max: [
                  0,
                  {
                    $subtract: [
                      1,
                      {
                        $divide: ["$distanceInMeters", radiusInMeters],
                      },
                    ],
                  },
                ],
              },
              30,
            ],
          },

          // Price score: maximum 10
          // Lower prices receive a higher score
          priceScore: {
            $multiply: [
              {
                $max: [
                  0,
                  {
                    $subtract: [
                      1,
                      {
                        $divide: [
                          "$pricePerService",
                          {
                            $max: ["$pricePerService", 1000],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              10,
            ],
          },
        },
      },

      // Calculate final score
      {
        $addFields: {
          matchScore: {
            $round: [
              {
                $add: [
                  "$ratingScore",
                  "$experienceScore",
                  "$distanceScore",
                  "$priceScore",
                ],
              },
              2,
            ],
          },
        },
      },

      // Sort best matches first
      {
        $sort: {
          matchScore: -1,
        },
      },

      // Remove internal scoring fields
      {
        $project: {
          distanceInMeters: 0,
          ratingScore: 0,
          experienceScore: 0,
          distanceScore: 0,
          priceScore: 0,
        },
      },
    ]);

    // Populate referenced documents
    await WorkerProfile.populate(workers, [
      {
        path: "user",
        select: "name phone",
      },
      {
        path: "service",
        select: "name category",
      },
    ]);

    res.status(200).json({
      success: true,
      count: workers.length,
      radius: radiusInKm,
      location: {
        latitude: lat,
        longitude: lng,
      },
      workers,
    });
  } catch (error) {
    console.error("Get Nearby Workers Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch nearby workers",
    });
  }
};

const getWorkerById = async (req, res) => {
  try {
    const { id } = req.params;

    const worker = await WorkerProfile.findOne({
      _id: id,
      isAvailable: true,
    })
      .populate("user", "name phone")
      .populate("service", "name category description icon");

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    res.status(200).json({
      success: true,
      worker,
    });
  } catch (error) {
    console.error("Get Worker By ID Error:", error.message);

    // Handles invalid MongoDB ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid worker ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch worker",
    });
  }
};



module.exports = {
  getWorkers,
  getNearbyWorkers,
  getWorkerById,
};
