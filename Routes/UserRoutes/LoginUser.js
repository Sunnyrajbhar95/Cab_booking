import express from "express";
import {
  handleLogin,
  handleVerifyOTP,
  logout
} from "../../controller/User/handleLogin.js";
import {
  profileUpdate,
  getProfile,
  updateProfilepicture,
  deleteProfile
} from "../../controller/User/profileUpdate.js";
// import { verifyUser } from '../../Middleware/userAuth.js'
  // import { verifyUser } from "../../Middleware/userAuth.js";
  import { uploads } from "../../Middleware/MulterConfig.js";
  import { verifyUser } from "../../Middleware/userAuth.js";
import UserControllers from "../../controller/User/user.controller.js";

export const userRouter = express.Router();

userRouter.post("/login", handleLogin);

userRouter.post("/verify", handleVerifyOTP);

userRouter.put("/updateUserDetails",verifyUser,uploads.single("profilePicture"), profileUpdate);

userRouter.get("/get-profile",verifyUser, getProfile);
 
userRouter.put("/update-profile",verifyUser,uploads.single("profilePicture"),updateProfilepicture)

userRouter.delete("/delete-profile",verifyUser, deleteProfile)

userRouter.post('/logout',logout)

          // bidding
          .post('/ride-accept-reject',verifyUser,UserControllers.acceptRejectRide)
          .put('/ride-fare-update',verifyUser,UserControllers.updateFareOfRide)