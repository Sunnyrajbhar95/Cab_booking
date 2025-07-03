import mongoose from "mongoose";

const userLogin = mongoose.Schema({
  phoneNumber: {
    type: String,
    required: [true, 'Please enter a valid phone number'],
    match: [/^[6-9]\d{9}$/, 'Please enter a valid phone number'],
    unique: true
  },
  otp: {
    type: String,
    match: [/^\d{4}$/, 'Please enter a valid 4 digit OTP']
  },
  otpExpiration: {
    type: Date,
    default : null
  },
  token: {
    type: String
  }
});

const UserLogin = mongoose.model("UserLogin", userLogin);

export default UserLogin;
