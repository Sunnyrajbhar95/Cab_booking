import mongoose from "mongoose";

const parcelCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    rquired: true,
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
  isActive:{
       type:Boolean,
       default:true
  }
});

const ParcelCategory=mongoose.model("ParcelCategory",parcelCategorySchema)

export default ParcelCategory
