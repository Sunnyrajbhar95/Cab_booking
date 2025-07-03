import Captain from "../../Model/captainPannel/captain.js";
import jwt from "jsonwebtoken";
const genrarateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};
export const login = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // const otp = genrarateOTP().toString();
    const otp="2709"

    const otpExpiration = new Date(Date.now() + 5 * 60 * 1000);
    const captain = await Captain.findOne({ phoneNumber });
    if (captain) {
      captain.otp = otp;
      captain.otpExpiration = otpExpiration;
      await captain.save();
    } else {
      await Captain.create({ phoneNumber, otp, otpExpiration });
    }
    return res
      .status(200)
      .send({
        message: "OTP Sent Successfully",
        phoneNumber,
        otp,
        success: true,
      });
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: err,
    });
  }
};

export const optVerifaiction = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    const captain = await Captain.findOne({ phoneNumber });
    if (!captain || captain.otp !== otp) {
      return res
        .status(400)
        .json({ message: "Invalid or expired OTP", succes: false });
    }
    const payload = {
      id: captain._id,
      phoneNumber,
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY);

    captain.token = token;
    captain.otp = null;
    captain.otpExpiration = null;
    captain.verified = true;
    await captain.save();
    return res
      .status(200)
      .json({ message: "OTP Verified", token, success: true,captainId:captain._id });
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: err,
    });
  }
};
