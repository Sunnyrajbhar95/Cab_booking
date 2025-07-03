import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Captain from "../Model/captainPannel/captain.js";
dotenv.config();

export const capAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    // console.log(token);
    if (!token) {
      return res.status(401).json({
        message: "Access Denied",
      });
    }
    const cap = jwt.verify(token, process.env.SECRET_KEY);

    const captain = await Captain.findOne({
      phoneNumber: cap.phoneNumber,
      verified: true,
    });
    if (!captain || captain.token !== token) {
      return res.status(401).json({ message: "Invalid token." });
    }
    req.captain=cap
    next();
  } catch (err) {
    return res.status(401).json({
      sucess: false,
      error: err,
    });
  }
  };
