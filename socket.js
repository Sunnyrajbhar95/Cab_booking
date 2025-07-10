import { Server } from "socket.io";
import express from "express";
import http from "http";
import User from "./Model/userPanel/userSchema.js";
import Captain from "./Model/captainPannel/captain.js";
import Profile from "./Model/captainPannel/profile.js";
import UserLogin from "./Model/userPanel/userLogin.js";
import Ride from "./Model/ride/rideSchema.js";
const app = express();
const server = http.createServer(app);

const userSockets = new Map();
const captainSockets = new Map();

export const setupSocket = (io) => {
  io.on("connection", async (socket) => {
    console.log(`✅ A user has connected: ${socket.id}`);
    socket.on("captainJoin", async (data) => {
      const captainId = socket.handshake.headers["captainid"];
      const lat = parseFloat(socket.handshake.headers["lat"]);
      const long = parseFloat(socket.handshake.headers["long"]);

      console.log(`Captain connected: ${socket.id} with ID: ${captainId}`);
      console.log(`lat: ${lat}, long: ${long}`);

      if (!captainId) {
        console.log(
          `❌ Captain ID is missing in headers for socket ${socket.id}`
        );
        return;
      }

      console.log(`Captain joined: ${socket.id} with Captain ID: ${captainId}`);
      socket.join("captainJoin");
      captainSockets.set(captainId, { socketId: socket.id, lat, long });
      console.log(`Captain ${captainId} joined captain room`);
    });

    socket.on("userJoin", async () => {
      const userId = socket.handshake.headers["userid"];

      if (!userId) {
        console.log(`❌ User ID is missing in headers for socket ${socket.id}`);
        return;
      }

      userSockets.set(userId, socket.id);
      console.log(`User joined: ${socket.id} with User ID: ${userId}`);
    });

    socket.on("disconnect", async () => {
      console.log("🔌 A user disconnected:", socket.id);

      // Clean up captainSockets
      for (let [captainId, data] of captainSockets.entries()) {
        if (data.socketId === socket.id) {
          captainSockets.delete(captainId);
          console.log(`Captain ${captainId} removed from map`);
          break;
        }
      }

      // Clean up userSockets
      for (let [userId, sockId] of userSockets.entries()) {
        if (sockId === socket.id) {
          userSockets.delete(userId);
          console.log(`User ${userId} removed from map`);
          break;
        }
      }
    });
  });
};

// 🚨 Keep a reference to io for use in other functions
let _io = null;
export const initSocket = (ioInstance) => {
  _io = ioInstance;
};

// Send new ride booking notification to all captains
export const sendRideBookingNotification = async (data) => {
  try {
    // const roomSockets = await _io.in("captainJoin").allSockets();
    // console.log("📊 Connected sockets in captainJoin room:", [...roomSockets]);
    _io?.emit("new_ride", {
      message: "You got a new ride",
      data,
    });

    setTimeout(() => {
      if (_io) {
        _io.emit("test", { message: "This is a test notification" });
        console.log("test notification sent ✅");
      } else {
        console.log("❌ _io is still null, cannot send test notification");
      }
    }, 3000);
    console.log(`📨 New ride notification sent`, data);
  } catch (error) {
    console.log(`❌ Error sending ride booking notification: ${error.message}`);
  }
};

// Send a new bid notification from captain to user
export const sendBiddingNotificationFromCaptain = async (data) => {
  try {
    const { userId, rideId, captainId, amount } = data;
    console.log("userId =>", userId);
    const user = await UserLogin.findById(userId);
    console.log("user =>", user);
    const captain = await Captain.findById(captainId);
    const captainProfile = await Profile.findOne({
      phoneNumber: captain?.phoneNumber,
    });

    if (!user) {
      console.log(`User not found, can't send notification to ${userId}`);
      return;
    }
    console.log("user sockets =>", userSockets);
    const socketId = userSockets.get(userId.toString());
    console.log("socketId => ", socketId);
    const payload = {
      captainProfile,
      amount,
      rideId,
    };

    if (socketId) {
      _io?.to(socketId).emit("new_bid_from_captain", {
        message: "New bid from a Captain",
        data: payload,
      });
      console.log(`📨 Bid sent to user ${userId}`);
    } else {
      console.log(
        `User ${user.name} is not connected, cannot send notification`
      );
    }
  } catch (error) {
    console.log(`❌ Error sending bidding notification: ${error.message}`);
  }
};

// Notify the captain about ride acceptance or rejection
export const sendAcceptanceRejectionNotificationToCaptain = async (data) => {
  try {
    const { status, captainId } = data;

    console.log("captainId ==>", captainId);
    const captainProfile = await Profile.findById(captainId);
    console.log("captain profile ==>", captainProfile);
    const captain = await Captain.findOne({
      phoneNumber: captainProfile.phoneNumber,
    });
    if (!captain) {
      console.log(`Captain not found with ID: ${captainId}`);
      return;
    }

    const captainSocketData = captainSockets.get(captain._id.toString());
    console.log("captain sockets ==>", captainSockets);
    console.log("captainSocketData =>", captainSocketData);

    if (captainSocketData?.socketId) {
      _io?.to(captainSocketData.socketId).emit("rideAcceptReject", {
        message: `Your ride request has been ${status}`,
        data,
        profilePicture: captainProfile?.profilePicture,
      });
      console.log(
        `📨 Acceptance/Rejection sent to Captain ${captainProfile?.name}`
      );
    } else {
      console.log(
        `Captain ${captainProfile?.name} is inactive, cannot send notification`
      );
    }
  } catch (error) {
    console.log(
      `❌ Error sending acceptance/rejection notification: ${error.message}`
    );
  }
};

// Send a counter bid notification to captains
export const sendCounterBidNotificationToCaptains = async (data) => {
  try {
    _io?.to("captainJoin").emit("counter_bid", {
      message: "User countered the fare",
      data,
    });
    console.log(`📨 Counter bid notification sent to captains`, data);
  } catch (error) {
    console.log(`❌ Error sending counter bid notification: ${error.message}`);
  }
};

// send the notification rider on the way
export const RiderOnTheWay = async (
  user_Id,
  captain_id,
  rideAmount,
  otp,
  rideId
) => {
  try {
    console.log(user_Id);
    console.log(captain_id, "captain id");
    const socketId = userSockets.get(user_Id.toString());
    // const captain = await Captain.findById(captain_id);

    const captainProfile = await Profile.findById(captain_id);

    const payload = {
      captainProfile,
      rideAmount,
      otp,
      rideId,
    };
    console.log(payload, "payload=======>");

    if (socketId) {
      console.log("socket Initiated");
      _io?.to(socketId).emit("captain_on_the_way", {
        message: "Captain on the way",
        payload,
      });
      console.log("socket Initiated");
    } else {
      console.log(`User is not connected, cannot send notification`);
    }
  } catch (error) {
    console.log(`❌ Error sending counter bid notification: ${error.message}`);
  }
};
export const cancelRideNotification = async (captain_Id) => {
  try {
    const profile = await Profile.findById(captain_Id);
    const captain = await Captain.findOne({
      phoneNumber: profile.phoneNumber,
    });
    if (!captain) {
      console.log(`Captain not found with ID: ${captain_Id}`);
      return;
    }

    const captainSocketData = captainSockets.get(captain._id.toString());

    if (captainSocketData?.socketId) {
      _io?.to(captainSocketData.socketId).emit("ride_cancel", {
        message: `Oops! Ride has been cancelled by the user`,
      });
    } else {
      console.log(
        `Captain ${captainProfile?.name} is inactive, cannot send notification`
      );
    }
  } catch (error) {
    console.log(`Error sending cancel ride notification:${error.message}`);
  }
};

export const completeRideNotification = async (user_Id, ride) => {
  try {
    console.log(user_Id, ride);
    const socketId = userSockets.get(user_Id.toString());

    if (socketId) {
      console.log("socket Initiated");
      _io?.to(socketId).emit("ride_complete_notification", {
        message: "Captain on the way",
        ride,
      });
      console.log("socket Initiated");
    } else {
      console.log(`User is not connected, cannot send notification`);
    }
  } catch (error) {
    console.log(`Error while sending notifiaction ${error.message}`);
  }
};

//sending  new ride booking notification to all active captains
export const sendNotificationToActiveCaptain = async (data,vehicle) => {
  try {
      
    console.log(data?.vehicleType)
    const captain=await Profile.find({vehicleId:data?.vehicleType,status:"Active"}).populate("captainId","_id")
     
    for(let rider of captain)
    { 
        //  console.log(rider?.captainId)
       const {socketId}=captainSockets.get(rider?.captainId?._id?.toString())
 
      //  console.log(socketId,"========>")
       if(socketId)
       {
            _io.to(socketId).emit("new_ride",{
                 message:"You got new ride notification",
                 data,
                 vehicle
            })
       }
    }
    // console.log(captain,"Just checking the captain id===>")
  } catch (error) {
    console.log(`❌ Error while sending notification: ${error.message}`);
  }
};
