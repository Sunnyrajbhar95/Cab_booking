import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import UserLogin from "../Model/userPanel/userLogin.js"

export const verifyUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  // console.log(token)
  if (!token) {
    return res.status(401).send("Access Denied");
  }
  try {
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    req.user = verified;
    const user = await UserLogin.findOne({ phoneNumber: verified.phoneNumber });

    if (!user) {
      return res.status(401).json({ message: "Invalid token." });
    }
    next();
  } catch (error) {
    return res.status(400).send("Invalid Token");
  }
}