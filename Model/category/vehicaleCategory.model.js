import mongoose from "mongoose";

const vehicaleCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
  description:{
       type:String,
       reqiured:true
  }
},{timestamps:true});

const Vehicale = mongoose.model("Vehicale", vehicaleCategorySchema);

export default Vehicale;
