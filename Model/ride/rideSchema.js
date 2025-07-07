import mongoose from "mongoose";

const rideSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserLogin",
      required: true,
    },
    captain_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Captain",
    },
    startLocation: {
      type: String,
      
    },
    endLocation: {
      type: String,
    },
    fare: {
      type: Number,
      required: true,
    },
    distance: {
      type: Number,
      required: true,
    },
    time:{
        type:String
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    rideType: {
      type: String,
      enum: ["InCity", "OutCity","Rental"],
      required: true,
    },
    vehicleType: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "SubVehicale",
    },
    tripMode: {
             type:String,
             enum:["OneWay","RoundTrip","Other"],
             default:"OneWay"  
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "On_The_Way",
        "Start",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
    },
    rideAmount: {
      type: Number,
    },
    otp: {
      type: Number,
    },
    paymentType: {
      type: String,
      enum: ["Online", "Cash On Delivery"],
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    sourceCoord: {
      lat: {
        type: Number,
      },
      lng: {
        type: Number,
      },
    },
    destinationCoord: {
      lat: {
        type: Number,
      },
      lng: {
        type: Number,
      },
    },
  },

  { timestamps: true }
);

const Ride = mongoose.model("Ride", rideSchema);

export default Ride;
