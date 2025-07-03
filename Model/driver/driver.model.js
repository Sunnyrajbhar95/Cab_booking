import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    mobileNumber: {
      type: String,
      required: [true, "Please enter your mobile number"],
      minlength: [10, "Phone number must be exactly 10 digits"],
      maxlength: [10, "Phone number must be exactly 10 digits"],
      match: [/^[6-9]\d{9}$/, "Please enter a valid 10-digit phone number"],
    },
    profilePicture: {
      type: String,
      validate: {
        validator: function (v) {
          return /\.(jpg|jpeg|png|webp)$/i.test(v);
        },
        message: "Only image files are allowed (.jpg, .jpeg, .png, .webp)",
      },
    },
    licenceNumber: {
      type: String,
      required: [true, "Please enter licence number"],
      minlength: [16, "Licence number must be exactly 16 digits"],
      maxlength: [16, "Licence number must be exactly 16 digits"],
    },
    licenceExpiryDate: {
      type: Date,
      required: [true, "Licence expiry date is required"],
    },
    licenceImage: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /\.(jpg|jpeg|png|webp)$/i.test(v);
        },
        message: "Only image files are allowed (.jpg, .jpeg, .png, .webp)",
      },
    },
    priceHr: {
      type: Number,
      required: true,
      default: 0,
    },
    pricePerDay: {
      type: Number,
      required: true,
      default: 0,
    },
    minExprience: {
      type: String,
      required: true,
    },
    maxExprience: {
      type: String,
      required: true,
    },
    vehicleType: {
      type: String,
      enum: ["Car", "Bike", "Auto", "Van"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "OnDuty", "OffDuty"],
      default: "Inactive",
    },
    isAllowed:{
         type:String,
         enum:["InCity","OutStation","Both"],
         required:true
  }
  },
  
  { timestamps: true }
);

const Driver = mongoose.model("Driver", driverSchema);

export default Driver;
