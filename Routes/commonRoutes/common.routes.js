import express from "express";
const commonRoutes = express.Router();
 import { capAuth } from "../../Middleware/captainAuth.js";
import { getAllCategory, getAllSubCategory } from "../../controller/vehicaleManagement/vehicaleCategory.controller.js";

commonRoutes.get("/vehicle-category",capAuth,getAllCategory)
             .get("/vehicle-subcategory/:categoryId",capAuth,getAllSubCategory)

export default commonRoutes;
