import Admin from "../Model/admin/admin.model.js";
import jwt from "jsonwebtoken";

export const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token not found",
      });
    }
    const verifyAdmin = jwt.verify(token, process.env.SECRET_KEY);
    const admin = await Admin.findById(verifyAdmin.id);
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
    (req.admin = verifyAdmin), next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || "internal Server Problem",
    });
  }
};
