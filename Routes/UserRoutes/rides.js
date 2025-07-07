import express from "express";
import {
  getRides,
  CreateRide,
  rideAcceptance,
  rideOtpVerification,
  getAllRide,
  rideCancel,
  userRideHistory,
  rideComplete,
  rideHistory,
  UpdateRideStatus,
  cancelRide
} from "../../controller/RideController/userRide.js";
import { verifyUser } from "../../Middleware/userAuth.js";
import { getRideForOutstation,createBookingForOutstation } from "../../controller/RideController/outstation.controller.js";
import { getRentalRide, rentalBooking } from "../../controller/RideController/rental.controller.js";
export const rideRouter = express.Router();

rideRouter.post("/getRide",verifyUser, getRides);

rideRouter.post("/book-ride",verifyUser, CreateRide);

rideRouter.put("/rideAcceptance/:id", rideAcceptance);

rideRouter.post("/rideOptVerification", rideOtpVerification);

rideRouter.get("/user/ride-history/:id",userRideHistory)

rideRouter.get("/captain/rides-History/:id", rideHistory);

rideRouter.patch("/rideCompletde/:id", rideComplete);

rideRouter.get('/allRide',getAllRide)

// rideRouter.patch("/cancelRide",rideCancel)





rideRouter.patch('/ride-status/:rideId',UpdateRideStatus)
rideRouter.patch('/cancel-ride/:rideId',cancelRide)
rideRouter.post("/out-station",verifyUser,getRideForOutstation)
rideRouter.post("/outStation-booking",verifyUser,createBookingForOutstation)
rideRouter.post("/get-rentalRide",verifyUser,getRentalRide),
rideRouter.post("/rental-booking",verifyUser,rentalBooking)

 