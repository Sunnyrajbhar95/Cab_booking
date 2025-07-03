import {
  login,
  optVerifaiction,
} from "../../controller/Captain/hnadleLogin.js";
import {
  updateProfile,
  getCaptainProfile,
  updateProfilepicture,
  vehicaleType,
  uploadDl,
  uploadAadhar,
  uploadPanDetails,
  uplaodRc,
  uplaodInsurance,
  uplaodPermit,
  updateStatus,
  updateActiveOrInactive,
  OtpVerification,
  CompleteRide,
  rideHistory,
  getSingleRideHistory,
  earningReport
} from "../../controller/Captain/updateProfile.js";
import { createBiddingFromCaptainSide, getAllRide } from "../../controller/RideController/userRide.js";

import { capAuth } from "../../Middleware/captainAuth.js";
import { uploads } from "../../Middleware/MulterConfig.js";

import express from "express";
export const router = express.Router();
router.post("/login", login);
router.post("/verify", optVerifaiction);
router.patch("/profileUpdate",capAuth,updateProfile);
router.put(
  "/update/profile-picture",
  capAuth,
  uploads.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "frontImage", maxCount: 1 },
    { name: "backImage", maxCount: 1 },
  ]),
  updateProfilepicture
);
router.get("/getprofile",capAuth, getCaptainProfile);
router.post("/vehicale-type", capAuth, vehicaleType);
router.patch(
  "/upload-license",
  capAuth,
  uploads.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "frontImage", maxCount: 1 },
    { name: "backImage", maxCount: 1 },
  ]),
  uploadDl
);

router.patch("/upload-aadhar",capAuth,uploads.fields([
  { name: "profilePicture", maxCount: 1 },
  { name: "frontImage", maxCount: 1 },
  { name: "backImage", maxCount: 1 },
]),uploadAadhar)

router.patch("/uplaod-panDetails",capAuth,uploads.fields([
  { name: "profilePicture", maxCount: 1 },
  { name: "frontImage", maxCount: 1 },
  { name: "backImage", maxCount: 1 },
]),
uploadPanDetails)

router.patch("/upload-rc",capAuth,uploads.fields([
  { name: "profilePicture", maxCount: 1 },
  { name: "frontImage", maxCount: 1 },
  { name: "backImage", maxCount: 1 },
]),uplaodRc)
router.patch("/upload-insurance",capAuth,uploads.fields([
  { name: "profilePicture", maxCount: 1 },
  { name: "frontImage", maxCount: 1 },
  { name: "backImage", maxCount: 1 },
]),uplaodInsurance)
router.patch("/upload-permit",capAuth,uploads.fields([
  { name: "profilePicture", maxCount: 1 },
  { name: "frontImage", maxCount: 1 },
  { name: "backImage", maxCount: 1 },
]),uplaodPermit)

router.patch("/update-status",capAuth,updateStatus)

      // bidding
      .put('/ride-bidding',capAuth,createBiddingFromCaptainSide)
      .patch("/updateActiveOrInactive",capAuth,updateActiveOrInactive)
      .patch("/otp-verification",capAuth,OtpVerification)
      .patch('/ride-complete/:rideId',capAuth,CompleteRide)
      .get("/rides",capAuth,rideHistory)
      .get("/ride/:rideId",getSingleRideHistory)
      .get("/earning-report",capAuth,earningReport)

  

