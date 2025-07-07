import Admin from "../../Model/admin/admin.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Profile from "../../Model/captainPannel/profile.js";
import Ride from "../../Model/ride/rideSchema.js";
import User from "../../Model/userPanel/userSchema.js";

export const AdminControllers = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Missing email or password",
        });
      }

      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin not found",
        });
      }

      // ⚠️ Compare, don’t hash:
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Wrong email or password",
        });
      }

      const token = jwt.sign(
        { id: admin._id, email: admin.email },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
      });
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({
        success: false,
        error: err.message || "Internal server error",
      });
    }
  },
  createDefaultAdmin: async () => {
    try {
      const email = "admin@tripcab.com";
      const password = "TripCab@123";

      const existingAdmin = await Admin.findOne();
      if (existingAdmin) {
        return console.log(`Admin is already present in database`);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = await Admin.create({
        email,
        password: hashedPassword,
      });

      if (admin) {
        console.log(`Admin has been created created successfully`);
      }
    } catch (error) {
      console.error("createDefaultAdmin error:", error.message);
    }
  },

  getAllCaptains: async (req, res) => {
    try {
      const captains = await Profile.find();

      return res.status(200).json({
        success: true,
        message:
          captains.length > 0
            ? "Captains fetched successfully"
            : "No captains found",
        captains,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message || "Internal server problem",
      });
    }
  },
  getSingleCaptain: async (req, res) => {
    try {
      const { id } = req.params;
      const captain = await Profile.findById(id);

      res.status(200).json({
        message: captain
          ? "Captain profile found"
          : "Unable to find captain's profile",
        success: true,
        captain,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
        success: false,
      });
    }
  },
  approveOrRejectCaptainProfile: async (req, res) => {
    try {
      const { approvalStatus, phoneNumber } = req.body;

      if (!approvalStatus) {
        return res.status(400).json({
          message: `Approval Status is required to approve or reject captain's profile`,
          success: false,
        });
      }
      if (!phoneNumber) {
        return res.status(400).json({
          message:
            "Captains phoneNumber is required to approve or reject the profile",
        });
      }

      const captain = await Profile.findOne({ phoneNumber });

      if (!captain) {
        return res.status(400).json({
          message: "Invalid captain",
          success: false,
        });
      }

      captain.profileStatus = approvalStatus;
      const updatedCaptainProfile = await captain.save();

      if (updatedCaptainProfile) {
        res.status(200).json({
          message: `Captain's profile has been ${approvalStatus}`,
          success: true,
        });
      } else {
        res.status(400).json({
          message: `Unable to ${approvalStatus} captain's profile`,
          success: false,
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: error.message,
        success: false,
      });
    }
  },

  rideHistory: async (req, res) => {
    try {
      const ride = await Ride.find(); // Fetch all rides

      if (!ride || ride.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Rides not found",
          data: [],
        });
      }

      // If rides found
      return res.status(200).json({
        success: true,
        message: "All the rides fetched successfully",
        data: ride, // prefer consistent naming like `data` instead of `ride`
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: err.message || "Internal server problem",
      });
    }
  },

  getSingleRideHistory: async (req, res) => {
    try {
      const { rideId } = req.params;

      // Check for missing rideId
      if (!rideId) {
        return res.status(400).json({
          success: false,
          message: "Ride ID is required",
        });
      }

      // Find the ride by ID
      const ride = await Ride.findById(rideId);

      // If ride is not found
      if (!ride) {
        return res.status(404).json({
          success: false,
          message: "Ride not found",
        });
      }

      // Success response
      return res.status(200).json({
        success: true,
        message: "Ride fetched successfully",
        data: ride, // prefer using `data` key for consistency
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: err.message || "Internal server error",
      });
    }
  },

  getAllUser: async (req, res) => {
    try {
      const users = await User.find();
      if (!users || !users.length) {
        return res.status(404).json({
          success: false,
          message: "Users Not found",
          data: [],
        });
      }

      return res.status(200).json({
        success: true,
        message: "User fetched successfully",
        users,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: err.message || " Internal Server problem",
      });
    }
  },

  getSingleUser: async (req, res) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is required",
        });
      }

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "User fetched successfully",
        user,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: err.message || "Internal server error",
      });
    }
  },

  //New controller for the  ride history by the basis of Incity, outCity, And rentel

  ridesFilter: async (req, res) => {
    try {
      const { status } = req.params;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: "Ride type status is required",
        });
      }

      const allowedTypes = ["InCity", "OutCity", "Rental"];
      if (!allowedTypes.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid ride type status",
        });
      }

      const rides = await Ride.find({ rideType: status })
        .populate("user_id", "phoneNumber")
        .populate("vehicleType");

      return res.status(200).json({
        success: true,
        message: rides.length ? "Rides found" : "No rides found",
        count: rides.length,
        rides,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: err.message,
      });
    }
  },
  getRidesByStatus: async (req, res) => {
    try {
      const { rideType, status } = req.query;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: "Status is required",
        });
      }

      const validStatuses = [
        "Pending",
        "Accepted",
        "On_The_Way",
        "Start",
        "Completed",
        "Cancelled",
      ];
      const validRideTypes = ["InCity", "OutCity", "Rental"];
      if (rideType && !validRideTypes.includes(rideType)) {
        return res.status(400).json({
          success: false,
          message: "Invalid ride type",
        });
      }

      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status",
        });
      }

      const rides = await Ride.find({ rideType, status })
      .populate("user_id","phoneNumber")
      .populate("vehicleType");

      if (!rides.length) {
        return res.status(404).json({
          success: false,
          message: "No rides found for this status",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Rides fetched successfully",
        rides,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: err.message || "Internal server error",
      });
    }
  },
};
