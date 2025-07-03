import mongoose from "mongoose";

const captainSchema = new mongoose.Schema(
  {
    captainId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Captain",
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    phoneNumber: {
      type: String,
      required: true,
      minlength: [10, "Enter a 10-digit mobile number"],
      maxlength: [10, "Enter a 10-digit mobile number"],
      match: [/^[6-9]\d{9}$/, "Please enter a valid phone number"],
    },
    vehicleId: {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"SubVehicale"
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    profilePicture: {
      type: String,
    },
    license: {
      number: {
        type: String,
        minlength: 12,
      },
      dob: {
        type: Date,
      },
      front_url: {
        type: String,
      },
    },
    adhar: {
      number: {
        type: String,
        minlength: 12,
      },
      front_url: {
        type: String,
      },
      backend_url: {
        type: String,
      },
    },
    pancard: {
      number: {
        type: String,
        minlength: 10,
      },
      front_url: {
        type: String,
      },
    },
    rc: {
      front_url: {
        type: String,
      },
    },
    insurance: {
      front_url: {
        type: String,
      },
    },
    permit: {
      front_url: {
        type: String,
      },
    },
    rideRequest: {
      type: String,
      enum: ["Approved", "Pending", "Rejected"],
      default: "Pending",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Inactive",
    },
    isDocumentUploaded: {
      type: Boolean,
      default: false,
    },
    profileStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", captainSchema);
export default Profile;
