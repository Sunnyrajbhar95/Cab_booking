import SubVehicale from "../../Model/category/vehicaleSubcatory.model.js";
import Ride from "../../Model/ride/rideSchema.js";
import UserLogin from "../../Model/userPanel/userLogin.js";

export const getRentalRide = async (req, res) => {
  try {
    const { time, distance } = req.body;

    if (!time || !distance) {
      return res.status(400).json({
        success: false,
        message: "time and distance is required",
      });
    }
    const vehicles = await SubVehicale.find({ isAllowed: "Rental" });
    const ridedetails = vehicles.map((vehicle) => {
      const amount = Math.round(
        Number(vehicle?.basePrice) +
          Number(vehicle?.pricePerHour) * Number(time) +
          Number(vehicle?.pricePerkm) * Number(distance)
      );

      return {
        vehicle,
        amount,
      };
    });

    return res.status(200).json({
      success: true,
      message: "fare fetched successfully",
      ridedetails,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal serevr Problem",
      error: err.message,
    });
  }
};

export const rentalBooking = async (req, res) => {
  try {
    const { id } = req.user;
    const { vehicleType, distance, fare, rideType, tripMode, time } = req.body;
    if (!id) {
      return res.status(401).json({
        success: false,
        message: "User Id Required",
      });
    }

    if (!vehicleType || !distance || !rideType || !tripMode || !time) {
      return res.status(401).json({
        success: false,
        message:
          "Vehical Type, Distance,rideType,time & tripMode fields are  required ",
      });
    }

    const user = await UserLogin.findById(id);
    if (!user)
      return res.status(404).json({
        success: false,
        message: "User Not found",
      });

    const vehicle = await SubVehicale.findById(vehicleType);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle is not found",
      });
    }

    if (vehicle?.isAllowed !== "Rental") {
      return res.status(409).json({
        success: false,
        message: "This vehicle is not allowed for the Rental booking ",
      });
    }

    // const otp = generateOTP();
    const ride = await Ride.create({
      user_id: id,
      fare: parseFloat(fare),
      distance,
      vehicleType,
      rideType,
      tripMode,
      time,
    });

    return res.status(200).json({
      success: true,
      message: "Ride created successfully",
      ride,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server problem",
      error: err.message,
    });
  }
};
