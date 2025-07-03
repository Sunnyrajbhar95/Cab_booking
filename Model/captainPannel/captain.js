import mongoose from "mongoose";

const captainLogin = mongoose.Schema({
  phoneNumber: {
    type: String,
    required: [true, 'Please enter a valid phone number'],
    match: [/^[6-9]\d{9}$/, 'Please enter a valid phone number'],
    unique: true
  },
  otp: {
    type: String,
    // match: [/^\d{6}$/, 'Please enter a valid 6 digit OTP']
  },
  verified:{
       type:Boolean,
       default:false
  },
  otpExpiration: {
    type: Date,
    default : null
  },
  token: {
    type: String
  }
});

const Captain=mongoose.model('Captain', captainLogin)

export default  Captain