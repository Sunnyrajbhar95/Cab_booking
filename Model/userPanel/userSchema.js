import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  userId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"UserLogin",
      required:true
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "please enter your email"],
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
    unique: true,
    minlength: [10, "Phone number must be exactly 10 digits"],
    maxlength: [10, "Phone number must be exactly 10 digits"],
    match: [/^[6-9]\d{9}$/, "Please enter a valid 10-digit phone number"],
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"],
  },
  photo: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
