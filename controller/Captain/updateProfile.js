import Profile from "../../Model/captainPannel/profile.js";
import path from "path";
import fs from "fs";
import Captain from "../../Model/captainPannel/captain.js";
import Ride from "../../Model/ride/rideSchema.js";
import { completeRideNotification } from "../../socket.js";
export const updateProfile = async (req, res) => {
  try {
    const { id } = req.captain;
    const { name, email, gender } = req.body;
    if (!id) {
      return res.status(401).json({
        success: false,
        message: "captain Id is required",
      });
    }
    if (!name || !email || !gender) {
      return res.status(401).json({
        success: false,
        message: "Mising required data",
      });
    }
    const captain = await Captain.findById(id);
    if (!captain) {
      return res.status(404).json({
        success: false,
        message: "Captain not found",
      });
    }
    const profile = await Profile.findOneAndUpdate(
      { phoneNumber: captain.phoneNumber },
      {
        $set: {
          name,
          email,
          gender,
        },
      },
      {
        new: true,
        upsert: true,
      }
    );

    return res.status(200).json({
      success: false,
      message: "Profile Updated successfully",
      profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getCaptainProfile = async (req, res) => {
  try {
    const { id } = req.captain;
    if (!id) {
      return res.status(401).json({
        success: false,
        message: "Captain id is required",
      });
    }
    const captain = await Captain.findById(id);
    if (!captain) {
      return res.status(404).json({
        success: false,
        message: "Captain not found ",
      });
    }
    const profile = await Profile.findOne({ phoneNumber: captain.phoneNumber });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile does not exist",
      });
    }
    return res.status(200).json({
      profile,
      success: true,
      message: "Profile fetched successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const updateProfilepicture = async (req, res) => {
  try {
    const { id } = req.captain;
    if (!id)
      return res.status(400).json({
        success: false,
        message: "captain id is required",
      });

    const captain = await Captain.findById(id);
    if (!captain) {
      return res.status(404).json({
        success: false,
        message: "Captain not found",
      });
    }
    const profile = await Profile.findOneAndUpdate({
      phoneNumber: captain.phoneNumber,
    });
    if (!captain)
      return res.status(404).json({
        success: false,
        message: "profile does not exist",
      });

    if (profile.profilePicture) {
      const filePath = path.join("public", "image", profile.profilePicture);
      console.log("File Path:", filePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("File deleted successfully");
      }
    }

    profile.profilePicture = req.files?.profilePicture[0].filename;
    await profile.save();
    return res.status(200).json({
      profile,
      success: true,
      message: "Profile Picture  Updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server Problem",
    });
  }
};
export const vehicaleType = async (req, res) => {
  try {
    const { id } = req.captain;
    const { vehicleId } = req.body;
    console.log(vehicleId);

    if (!id) {
      return res.status(401).json({
        success: false,
        message: "Captain Id is required",
      });
    }

    if (!vehicleId) {
      return res.status(401).json({
        success: false,
        message: "Vehical id is required",
      });
    }

    const captain = await Captain.findById(id);
    if (!captain) {
      return res.status(404).json({
        success: false,
        message: "Captain not found",
      });
    }

    const profile = await Profile.findOneAndUpdate(
      { phoneNumber: captain.phoneNumber },
      {
        $set: {
          phoneNumber: captain.phoneNumber,
          vehicleId,
          captainId: id,
        },
      },
      {
        new: true,
        upsert: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Vehical type updated successfully",
      profile,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server problem",
    });
  }
};
export const uploadDl = async (req, res) => {
  try {
    const { id } = req.captain;
    const { number, dob } = req.body;

    if (!id) {
      return res.status(401).json({
        success: false,
        message: "Captain id is required",
      });
    }

    if (!req?.files?.frontImage) {
      return res.status(400).json({
        success: false,
        message: "Both front and back license images are required",
      });
    }

    const captain = await Captain.findById(id);
    if (!captain) {
      return res.status(404).json({
        success: false,
        message: "Captain not found",
      });
    }

    const frontImage = req.files.frontImage[0]?.filename;
    // const backImage = req.files.backImage[0]?.filename;

    const license = {
      number,
      dob,
      front_url: frontImage,
    };

    const profile = await Profile.findOneAndUpdate(
      { phoneNumber: captain.phoneNumber },
      {
        $set: { license },
      },
      {
        new: true,
        upsert: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Driving license uploaded successfully",
      profile,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || "Internal Server Error",
    });
  }
};
export const uploadAadhar = async (req, res) => {
  try {
    const { id } = req.captain;
    const { number } = req.body;

    if (!id) {
      return res.status(401).json({
        success: false,
        message: "Captain id is required",
      });
    }

    if (!req?.files?.frontImage || !req?.files?.backImage) {
      return res.status(400).json({
        success: false,
        message: "Both front and back license images are required",
      });
    }

    const captain = await Captain.findById(id);
    if (!captain) {
      return res.status(404).json({
        success: false,
        message: "Captain not found",
      });
    }

    const frontImage = req.files.frontImage[0]?.filename;
    const backImage = req.files.backImage[0]?.filename;

    const adhar = {
      number,
      front_url: frontImage,
      backend_url: backImage,
    };

    const profile = await Profile.findOneAndUpdate(
      { phoneNumber: captain.phoneNumber },
      {
        $set: { adhar },
      },
      {
        new: true,
        upsert: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Aadhar uploaded successfully",
      profile,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || "Internal Server Error",
    });
  }
};

export const uploadPanDetails = async (req, res) => {
  try {
    const { id } = req.captain;
    const { number } = req.body;

    if (!id) {
      return res.status(401).json({
        success: false,
        message: "Captain id is required",
      });
    }

    if (!req?.files?.frontImage) {
      return res.status(400).json({
        success: false,
        message: "Images are required",
      });
    }

    const captain = await Captain.findById(id);
    if (!captain) {
      return res.status(404).json({
        success: false,
        message: "Captain not found",
      });
    }

    const frontImage = req.files.frontImage[0]?.filename;
    const pancard = {
      number,
      front_url: frontImage,
    };

    const profile = await Profile.findOneAndUpdate(
      { phoneNumber: captain.phoneNumber },
      {
        $set: { pancard },
      },
      {
        new: true,
        upsert: true,
      }
    );
    return res.status(200).json({
      success: true,
      message: "Pan Detail  uploaded successfully",
      profile,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || "Internal Server Error",
    });
  }
};
export const uplaodInsurance = async (req, res) => {
  try {
    const { id } = req.captain;
    if (!id) {
      return res.status(401).json({
        success: false,
        message: "Captain id is required",
      });
    }

    if (!req?.files?.frontImage) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const captain = await Captain.findById(id);
    if (!captain) {
      return res.status(404).json({
        success: false,
        message: "Captain not found",
      });
    }

    const frontImage = req.files.frontImage[0]?.filename;
    const insurance = {
      front_url: frontImage,
    };

    const profile = await Profile.findOneAndUpdate(
      { phoneNumber: captain.phoneNumber },
      {
        $set: { insurance },
      },
      {
        new: true,
        upsert: true,
      }
    );
    return res.status(200).json({
      success: true,
      message: "Insurance uploaded successfully",
      profile,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || "Internal Server Error",
    });
  }
};
export const uplaodRc = async (req, res) => {
  try {
    const { id } = req.captain;
    if (!id) {
      return res.status(401).json({
        success: false,
        message: "Captain id is required",
      });
    }

    if (!req?.files?.frontImage) {
      return res.status(400).json({
        success: false,
        message: "images are required",
      });
    }

    const captain = await Captain.findById(id);
    if (!captain) {
      return res.status(404).json({
        success: false,
        message: "Captain not found",
      });
    }

    const frontImage = req.files.frontImage[0]?.filename;
    const rc = {
      front_url: frontImage,
    };

    const profile = await Profile.findOneAndUpdate(
      { phoneNumber: captain.phoneNumber },
      {
        $set: { rc },
      },
      {
        new: true,
        upsert: true,
      }
    );
    return res.status(200).json({
      success: true,
      message: "Rc  uploaded successfully",
      profile,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || "Internal Server Error",
    });
  }
};
export const uplaodPermit = async (req, res) => {
  try {
    const { id } = req.captain;
    if (!id) {
      return res.status(401).json({
        success: false,
        message: "Captain id is required",
      });
    }

    if (!req?.files?.frontImage) {
      return res.status(400).json({
        success: false,
        message: "Image are required",
      });
    }

    const captain = await Captain.findById(id);
    if (!captain) {
      return res.status(404).json({
        success: false,
        message: "Captain not found",
      });
    }

    const frontImage = req.files.frontImage[0]?.filename;
    const permit = {
      front_url: frontImage,
    };

    const profile = await Profile.findOneAndUpdate(
      { phoneNumber: captain.phoneNumber },
      {
        $set: { permit },
      },
      {
        new: true,
        upsert: true,
      }
    );
    return res.status(200).json({
      success: true,
      message: "Premit uploaded successfully",
      profile,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || "Internal Server Error",
    });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id } = req.captain;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Captain ID is required", // typo fixed from 'meesage'
      });
    }

    const captain = await Captain.findById(id);
    if (!captain) {
      return res.status(404).json({
        success: false,
        message: "Captain not found",
      });
    }

    const profile = await Profile.findOne({ phoneNumber: captain.phoneNumber });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    profile.isDocumentUploaded = true;
    await profile.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server problem",
    });
  }
};

export const updateActiveOrInactive = async (req, res) => {
  try {
    const { id } = req.captain;
    const { status } = req.body;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Captain id is reqiured",
      });
    }

    const captain = await Captain.findById(id);
    if (!captain) {
      return res.status(404).json({
        success: false,
        message: "Captain not found",
      });
    }
    const profile = await Profile.findOne({ phoneNumber: captain.phoneNumber });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "profile not found",
      });
    }
    profile.status = status;
    await profile.save();
    return res.status(200).json({
      success: true,
      message: "status updated successfully",
      profile,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const OtpVerification = async (req, res) => {
  try {
    const { otp, rideId } = req.body;

    if (!rideId) {
      return res.status(400).json({
        success: false,
        message: "rideId is required",
      });
    }

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "Otp is required",
      });
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }

    if (ride.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    ride.status = "Start";

    ride.startTime = new Date();
    await ride.save();

    return res.status(200).json({
      success: true,
      message: "OTP Verified Successfully",
      ride,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server problem",
    });
  }
};

export const CompleteRide = async (req, res) => {
  try {
    const { rideId } = req.params;

    if (!rideId) {
      return res.status(400).json({
        success: false,
        message: "Ride ID is required",
      });
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }

    // ✅ Only allow completion if ride is "start"
    if (ride.status !== "Start") {
      return res.status(400).json({
        success: false,
        message: `Ride cannot be completed as it is currently '${ride.status}'`,
      });
    }

    // ✅ Mark ride as completed
    ride.status = "Completed";
    ride.endTime = new Date();
    await ride.save();
    completeRideNotification(ride.user_id, ride);
    return res.status(200).json({
      success: true,
      message: "Ride completed successfully",
      ride,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const rideHistory = async (req, res) => {
  try {
    const id = req.captain.id;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "user id required",
      });
    }

    const captain = await Captain.findById(id);
    if (!captain) {
      return res.status(404).json({
        success: false,
        message: "captain not found",
      });
    }
    console.log(captain, "================>captain mil gaya");
    const profile = await Profile.findOne({
      phoneNumber: captain.phoneNumber,
    });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    console.log(profile, "profile mill gayi");

    console.log("===========================>", profile._id);

    const rides = await Ride.find({ captain_id: profile._id });

    console.log(rides, "==============>rides mil gayi");
    if (!rides || rides.length == 0) {
      return res.status(404).json({
        success: false,
        message: "No rides found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Rides fetched successfully",
      rides,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server problem",
    });
  }
};

export const getSingleRideHistory = async (req, res) => {
  try {
    const { rideId } = req.params;
    if (!rideId) {
      return res.status(400).json({
        success: false,
        message: "Ride is Required",
      });
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Ride fetched successfully",
      ride,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server problem",
    });
  }
};

export const earningReport = async (req, res) => {
  try {
    const { id } = req.captain;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Captain id is required",
      });
    }
    const captain = await Captain.findById(id);
    if (!captain) {
      return res.status(404).json({
        success: false,
        message: "invalid captain ",
      });
    }
    const rideDetails = await Ride.find({
      captain_id: id,
      status: "Completed",
      paymentStatus: "Paid",
    });
    var totalAmount = 0;
    rideDetails.forEach((ride) => {
      totalAmount += parseInt(ride?.rideAmount);
    });

    return res.status(200).json({
      success: true,
      message: "Earning report fetched successfully",
      totalAmount,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server problem",
      error: err.message,
    });
  }
};
