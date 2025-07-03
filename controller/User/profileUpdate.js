// import UserLogin from "../../Model/userPanel/userLogin.js";
import User from "../../Model/userPanel/userSchema.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import UserLogin from "../../Model/userPanel/userLogin.js";

export const profileUpdate = async (req, res) => {
  try {
    const { id } = req.user;
    const { name, email, gender } = req.body;
    const phoneNumber = req.user.phoneNumber;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid User",
      });
    }
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required",
      });
    }
    const isUser = await UserLogin.findById(id);
    if (!isUser) {
      return res.status(404).json({
        success: false,
        message: "User Not found",
      });
    }
    const user = await User.findOneAndUpdate(
      { phoneNumber }, // Search condition
      { $set: { name, email, gender, userId:id } }, 
      { new: true, upsert: true, runValidators: true } 
    );
    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const phoneNumber = req.user.phoneNumber;
    if (!phoneNumber)
      return res.status(400).json({
        success: false,
        message: "Missing data",
      });
    const user = await User.findOne({ phoneNumber });
    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    return res.status(200).json({
      user,
      success: true,
      message: "Profile fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetched profile",
      error,
    });
  }
};

export const updateProfilepicture = async (req, res) => {
  try {
    // const userId = req.params.id;
    const phoneNumber = req.user.phoneNumber;
    console.log(req.user);
    // console.log(req.file.filename);
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "User id not found",
      });
    }
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }
    if (user.photo) {
      const filePath = path.join("public", "image", user.photo);
      console.log("File Path:", filePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("File deleted successfully");
      }
    }
    user.photo = req.file?.filename;
    const respnse = await user.save();
    return res.status(200).json({
      respnse,
      success: true,
      message: "Profile picture updated success fully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const phoneNumber = req.user.phoneNumber;
    // console.log(req.params.id);
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User id not found",
      });
    }
    const user = await User.findOne({ phoneNumber });

    if (user.photo) {
      const filePath = path.join("public", "image", user.photo);
      console.log("File Path:", filePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("File deleted successfully");
      }
    }
    await UserLogin.deleteOne({ phoneNumber: user.phoneNumber });
    await User.deleteOne({ phoneNumber: user.phoneNumber });

    return res.status(200).json({
      success: true,
      message: "Account Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
