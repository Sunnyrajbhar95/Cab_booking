import mongoose from "mongoose";

const parcelSubcategorySchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ParcelCategory",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
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
    minWeight: {
      type: Number,
      required: [true, "Minimum weight is required"],
      min: 0,
      max: 100,
    },
    maxWeight: {
      type: Number,
      required: [true, "Maximum weight is required"],
      min: 0,
      max: 100,
      validate: {
        validator: function (v) {
          return v >= this.minWeight;
        },
        message: "max weight is greater or greater than eqaul to min weight",
      },
    },
    basePrice: {
      type: Number,
      required: true,
      default: 0,
    },
    isAllowed: {
      type: String,
      enum: ["IncityBooking", "OutStation", "other"],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    deliveryOptions: [
      {
        type: {
          type: String,
          enum: ["Standard", "Fast", "Express"],
          required: true,
        },
        pricePerKm: {
          type: Number,
          required: true,
        },
        estimatedTime: {
          type: String, // e.g., "1-2 hours", "30-45 mins"
          required: false,
        },
      },
    ],
  },
  { timestamps: true }
);

const ParcelSubcategory = mongoose.model(
  "ParcelSubcategory",
  parcelSubcategorySchema
);

export default ParcelSubcategory;
