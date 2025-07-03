import mongoose from "mongoose";

const blackListedToken = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    index:{ expires: "24h" } }
});

const BlackListedToken= mongoose.model("BlackListedToken",blackListedToken)
export default BlackListedToken
