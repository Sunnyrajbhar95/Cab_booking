import { getDistance } from "./GetLocation.js";
import Ride from "../../Model/ride/rideSchema.js";
// import { findNearbyCaptains } from "../../utilities/index.js";
import User from "../../Model/userPanel/userSchema.js";
import Captain from "../../Model/captainPannel/captain.js";
import {
  sendBiddingNotificationFromCaptain,
  sendRideBookingNotification,
  RiderOnTheWay,
  cancelRideNotification,
  sendNotificationToActiveCaptain,
} from "../../socket.js";
import SubVehicale from "../../Model/category/vehicaleSubcatory.model.js";
import UserLogin from "../../Model/userPanel/userLogin.js";
const baseFare = {
  auto: 5,
  car: 20,
  bike: 15,
};

const perKmRate = {
  auto: 10,
  car: 15,
  bike: 8,
};

const perMinuteRate = {
  auto: 2,
  car: 3,
  bike: 1.5,
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

// calculate fare from source to destinatio
const calculateFare = (vehicalType, distance) => {
  const fare = Math.round(
    baseFare[vehicalType] + distance * perKmRate[vehicalType]
  );
  return fare;
};
// To calculate the fare between source and destination
const fareAndTime = (distance) => {
  const fareAndTime = {
    auto: {
      price: Math.round(baseFare.auto + distance * perKmRate.auto),
    },
    car: {
      price: Math.round(baseFare.car + distance * perKmRate.car),
    },
    bike: {
      price: Math.round(baseFare.bike + distance * perKmRate.bike),
    },
  };
  return fareAndTime;
};
// to get distance and time and price from source to destination

export const getRides = async (req, res) => {
  try {
    const { distance } = req.body;
    if (!distance) {
      return res.status(400).json({
        success: false,
        message: "Distance is required",
      });
    }

    const vehicles = await SubVehicale.find({ isAllowed: "InCityBooking" });

    if (!vehicles) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    const ridedetails = vehicles.map((vehicle) => {
      const amount = Math.round(
        vehicle?.basePrice + distance * vehicle.pricePerkm
      );
      return {
        vehicle,
        amount,
      };
    });

    console.log(ridedetails);

    return res.status(200).json({
      success: true,
      message: "Available Ride",
      ridedetails,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || "Internal Server Problem",
    });
  }
};

//Ride booking  logic
export const CreateRide = async (req, res) => {
  try {
    const { id } = req.user;
    const {
      vehicleType,
      distance,
      source,
      destination,
      sourceCoord,
      destinationCoord,
      fare,
      rideType,
      tripMode,
    } = req.body;
    if (!id) {
      return res.status(401).json({
        success: false,
        message: "User Id Required",
      });
    }

    if (
      !vehicleType ||
      !distance ||
      !source ||
      !destination ||
      !sourceCoord ||
      !destinationCoord ||
      !rideType ||
      !tripMode
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Vehical Type, Distance, Source, destination,rideType,tripMode,sourceCoord & destinationCoord fields are  required ",
      });
    }

    const user = await UserLogin.findById(id);
    if (!user)
      return res.status(404).json({
        success: false,
        message: "User Not found",
      });

    const otp = generateOTP();
    const ride = await Ride.create({
      user_id: id,
      startLocation: source,
      endLocation: destination,
      fare: parseFloat(fare),
      distance,
      vehicleType,
      otp,
      sourceCoord,
      destinationCoord,
      startDate: new Date(),
      rideType,
      tripMode,
    });
    // sendRideBookingNotification(ride);
    // sendNotificationToActiveCaptain(ride)
    return res.status(200).json({
      success: true,
      message: "Ride created successfully",
      ride,
    });
  } catch (err) {
    console.log("create ride error => ", err.stack);
    return res.status(500).json({
      success: false,
      error: err.message || "Internal Server Problem",
    });
  }
};

// Captain ride history
export const rideHistory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(401).json({
        success: false,
        message: " ID is required",
      });
    }

    const rides = await Ride.find({ captain_id: id });
    if (rides.length == 0) {
      return res.status(401).json({
        success: false,
        message: "ride not found",
      });
    }

    return res.status(200).json({
      rides,
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      success: false,
      message: "Internal server Problem",
    });
  }
};



export const createBiddingFromCaptainSide = async (req, res) => {
  try {
    const captainId = req.captain.id;
    const { rideId, amount } = req.body;

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(400).json({
        message: "Invalid ride ID",
        success: false,
      });
    }

    if (ride.fare > amount) {
      return res.status(400).json({
        message: "You can't bid below base price of ride",
        success: false,
      });
    }

    const data = {
      rideId,
      userId: ride.user_id,
      amount,
      captainId,
    };
    sendBiddingNotificationFromCaptain(data);

    res.status(200).json({
      message: "Bid has been created successfully",
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//rideacceptance notifiaction for user is working

export const rideAcceptance = async (req, res) => {
  try {
    const { ride_id } = req.body;
    const captain_id = req.params.id;
    console.log(captain_id);

    // Validate required fields
    if (!ride_id || !captain_id) {
      return res
        .status(400)
        .json({ success: false, message: "Captain ID or Ride ID is required" });
    }

    // Check if the captain exists
    const captain = await Captain.findById(captain_id);
    console.log(captain);
    if (!captain) {
      return res
        .status(404)
        .json({ success: false, message: "Captain not found" });
    }

    // Generate OTP
    const generateOtp = generateOTP(); // Fixed typo

    // Atomic update to prevent race condition
    const ride = await Ride.findOneAndUpdate(
      { _id: ride_id, status: "pending" }, // Ensure ride is still pending
      { status: "accepted", captain_id, otp: generateOtp },
      { new: true } // Return updated ride
    );

    if (!ride) {
      return res
        .status(400)
        .json({ success: false, message: "Ride is already accepted" });
    }

    // const { io, activeUser } = req;
    // Emit WebSocket event only if user is online
    // if (activeUser[ride.user_id]) {
    //   io.to(activeUser[ride.user_id]).emit("rideAccepted", {
    //     id: ride._id,
    //     captain_id,
    //     phoneNumber: captain.phoneNumber,
    //     generateOtp,
    //     message: "Your ride has been accepted!",
    //   });
    // }

    res.status(200).json({
      success: true,
      message: "Ride accepted",
      otp: generateOtp, // Return OTP
    });
  } catch (err) {
    console.error("Error accepting ride:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};




// Ride completion logic
export const rideComplete = async (req, res) => {
  try {
    const { ride_id } = req.body;

    if (!ride_id) {
      return res
        .status(400)
        .json({ success: false, message: "Ride ID is required" });
    }

    // Use findOneAndUpdate to prevent race conditions
    const ride = await Ride.findOneAndUpdate(
      { _id: ride_id, status: "accepted" }, // Ensure only accepted rides can be completed
      { status: "completed" },
      { new: true } // Return updated document
    );

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found or already completed/canceled",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Ride completed successfully",
      ride,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Ride otp verifiaction  logic
export const rideOtpVerification = async (req, res) => {
  try {
    const { ride_id, otp } = req.body;
    if (!ride_id) {
      return res.status(400).json({
        success: false,
        message: "Ride id is required",
      });
    }
    const ride = await Ride.findById(ride_id);
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }
    if (ride.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid otp",
      });
    }
    ride.otp = null;
    await ride.save();
    return res.status(200).json({
      success: true,
      message: "Opt verified successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Problem",
    });
  }
};

// Ride Concellation logic
export const rideCancel = async (req, res) => {
  try {
    const { ride_id, user_id } = req.body; // Extract from req.body, not req.params
    const { io, activeCaptains } = req;

    // Validate required fields
    if (!ride_id || !user_id) {
      return res.status(400).json({
        success: false,
        message: "Ride ID and User ID are required.",
      });
    }

    // Find ride by ID
    const ride = await Ride.findById(ride_id);
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found.",
      });
    }

    // Check if the requesting user is the ride owner
    if (ride.user_id?.toString() !== user_id) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to cancel this ride.",
      });
    }

    // Prevent cancellation if the ride is already completed
    if (ride.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Ride is already completed, cannot be cancelled.",
      });
    }

    // Prevent re-cancellation
    if (ride.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Ride is already cancelled.",
      });
    }

    // Mark ride as cancelled
    ride.status = "cancelled";
    await ride.save();

    // Notify captain if assigned
    if (ride.captain_id && activeCaptains[ride.captain_id]) {
      const captainSocketId = activeCaptains[ride.captain_id].socketId;
      io.to(captainSocketId).emit("rideCancelled", {
        rideId: ride._id, // Use `_id` instead of `id`
        message: "The ride has been cancelled by the user.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Ride cancelled successfully.",
    });
  } catch (err) {
    console.error("Error in rideCancel:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//All rides for the admin logic
export const getAllRide = async (req, res) => {
  try {
    const rides = await Ride.find();
    return res
      .status(200)
      .json({ rides, success: true, message: "Getting All Ride Successfully" });
  } catch (err) {
    console.log(err);
    return res
      .status(401)
      .json({ success: false, message: "internal server problem" });
  }
};

// UserRide History
export const userRideHistory = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId)
      return res
        .status(400)
        .json({ success: false, message: "user id required" });

    const rides = await Ride.find({ user_id: userId }).populate("captain_id");
    if (rides.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Rides Not found" });
    }
    return res.status(200).json({
      rides,
      success: true,
      message: "Rides fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || "Internal Server Problem",
    });
  }
};

export const UpdateRideStatus = async (req, res) => {
  try {
    const { rideId } = req.params;
    if (!rideId) {
      return res.status(400).json({
        sucess: false,
        message: "rideId not found",
      });
    }
    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({
        sucess: false,
        message: "Ride does not exist",
      });
    }

    ride.status = "On_The_Way";
    await ride.save();
    RiderOnTheWay(
      ride.user_id,
      ride.captain_id,
      ride.rideAmount,
      ride.otp,
      rideId
    );
    return res.status(200).json({
      sucess: true,
      message: "Status updated successfully",
      ride,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server problem",
    });
  }
};

export const cancelRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    if (!rideId) {
      return res.status(400).json({
        success: false,
        message: "Ride Id is required",
      });
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }

    if (["Start", "Completed", "Cancelled"].includes(ride.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a ride that is already ${ride.status}`,
      });
    }

    ride.status = "Cancelled";
    await ride.save();

    cancelRideNotification(ride.captain_id);
    return res.json({
      success: true,
      message: "Ride cancelled successfully",
      ride,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server problem",
    });
  }
};
