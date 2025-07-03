import SubVehicale from "../../Model/category/vehicaleSubcatory.model.js";
import Ride from "../../Model/ride/rideSchema.js";
import UserLogin from "../../Model/userPanel/userLogin.js"

export const getRideForOutstation = async (req, res) => {
  try {
    const { distance, tripMode } = req.body;

    if (!distance || distance <= 0) {
      return res.status(400).json({
        success: false,
        message: "Distance is required",
      });
    }
    if (!tripMode) {
      return res.status(400).json({
        success: false,
        message: "Trip Mode is required",
      });
    }
    const vehicles = await SubVehicale.find({ isAllowed: "OutstationBooking" });
    const rideDetail = vehicles.map((vehicle) => {
      var totalAmount = Math.round(
        Number(vehicle?.basePrice) +
          Number(vehicle?.pricePerkm) * Number(distance)
      );
      if (tripMode === "RoundTrip") totalAmount = 2 * totalAmount;
      return {
        vehicle,
        totalAmount,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Fare fetched successfully",
      rideDetail,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server Problem",
      error: err.message,
    });
  }
};

export const createBookingForOutstation = async (req, res) => {
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
      startDate,
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
      !tripMode ||
      !startDate
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

    // const otp = generateOTP();
    const ride = await Ride.create({
      user_id: id,
      startLocation: source,
      endLocation: destination,
      fare: parseFloat(fare),
      distance,
      vehicleType,
      sourceCoord,
      destinationCoord,
      startDate,
      rideType,
      tripMode,
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
