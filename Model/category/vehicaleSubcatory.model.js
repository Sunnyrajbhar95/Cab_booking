import mongoose from "mongoose";

const vehicalSubcategory = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicale",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description:{
     type:String,
     required:true
  },
  image: {
    type: String,
    validate: {
      validator: function (v) {
        return /\.(jpg|jpeg|png|webp)$/i.test(v);
      },
      message: "Only image files are allowed (.jpg, .jpeg, .png, .webp)",
    },
  },
  vehicaleType: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  pricePerkm: {
    type: Number,
    required: true,
    default: 0,
  },
  pricePerHour: {
    type: Number,
    required: true,
    default: 0,
  },
  basePrice: {
    type: Number,
    required: true,
    default: 0,
  },

  isAllowed: {
    type: String,
    enum: [
      "InCityBooking",
      "OutstationBooking",
      "Rental",
      "DriverBooking",
      "ParcelBooking",
      "Other"
    ],
  },
  comfortLevel: {
    type: String,
    enum: ["Economy", "Comfort", "Premium", "Luxury", "Shared"],
    required: true,
  },
},{timestamps:true});

const SubVehicale = mongoose.model("SubVehicale", vehicalSubcategory);
export default SubVehicale;
