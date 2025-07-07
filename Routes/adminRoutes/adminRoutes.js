import express from "express";
import { AdminControllers } from "../../controller/adminController/admin.controller.js";
import { verifyAdmin } from "../../Middleware/adminAuth.js";
import {
  addVehicaleCategory,
  addVehicaleSubcategory,
  deleteSubVehicleCategory,
  deleteVechicleCategory,
  getAllCategory,
  getAllSubCategory,
  updateCategory,
  updatesubCategory,
} from "../../controller/vehicaleManagement/vehicaleCategory.controller.js";

import { uploads } from "../../Middleware/MulterConfig.js";
import {
  addParcelCategory,
  addParcelSubcategory,
  deleteParcelCategory,
  deleteSubParcelCatgory,
  getAllParcelCategory,
  getAllSubParcel,
  updateParcelCategory,
  updateParcelSubcategory,
} from "../../controller/ParcelMangement/parcel.controller.js";
import {
  addDriver,
  deleteDriver,
  getAllDriver,
  getSingleDriver,
  updateDriver,
} from "../../controller/DriverManagement/driver.controller.js";

const adminRoute = express.Router();
const adminProtectedRoute = express.Router();

adminProtectedRoute.use(verifyAdmin);

// public routes for admin
adminRoute.post("/login", AdminControllers.login);

// protected routes for admin
adminProtectedRoute
  .get("/captains", AdminControllers.getAllCaptains)
  .get("/captains/:id", AdminControllers.getSingleCaptain)
  .put("/captains", AdminControllers.approveOrRejectCaptainProfile)
  .get("/rideHistory", AdminControllers.rideHistory)
  .get("/single-ride/:rideId", AdminControllers.getSingleRideHistory)
  .get("/ridesByStatus/", AdminControllers.getRidesByStatus)
  .get("/getAllUser", AdminControllers.getAllUser)
  .get("/user/:userId", AdminControllers.getSingleUser)

  //Route related  to  the vehicale
  .post("/vehicale-category", uploads.single("image"), addVehicaleCategory)
  .post(
    "/vehicale-subcategory",
    uploads.single("image"),
    addVehicaleSubcategory
  )
  .get("/vehicale-category", getAllCategory)
  .get("/vehicale-subcategory/:categoryId", getAllSubCategory)
  .put("/vehicale-subcategory/:id", uploads.single("image"), updatesubCategory)
  .put("/vehicale-category/:id", uploads.single("image"), updateCategory)
  .delete("/vehicale-category/:id", deleteVechicleCategory)
  .delete("/vehicale-subcategory/:id", deleteSubVehicleCategory)
  //Route related to the parcel
  .post("/parcel", uploads.single("image"), addParcelCategory)
  .get("/parcel", getAllParcelCategory)
  .put("/parcel/:id", uploads.single("image"), updateParcelCategory)
  .delete("/parcel/:id", deleteParcelCategory)
  .post("/sub-parcel", uploads.single("image"), addParcelSubcategory)
  .get("/sub-parcel/:id", getAllSubParcel)
  .delete("/sub-parcel/:id", deleteSubParcelCatgory)
  .put("/sub-parcel/:id", uploads.single("image"), updateParcelSubcategory)
  //Route related to the driver
  .post(
    "/driver",
    uploads.fields([
      { name: "profilePicture", maxCount: 1 },
      { name: "licence", maxCount: 1 },
    ]),

    addDriver
  )
  .get("/driver", getAllDriver)
  .get("/driver/:id", getSingleDriver)
  .delete("/driver/:id", deleteDriver)
  .put(
    "/driver/:id",
    uploads.fields([
      { name: "profilePicture", maxCount: 1 },
      { name: "licence", maxCount: 1 },
    ]),
    updateDriver
  )
  // Route related to filter ride
  .get("/ride/:status",AdminControllers.ridesFilter)

adminRoute.use(adminProtectedRoute);

export default adminRoute;
