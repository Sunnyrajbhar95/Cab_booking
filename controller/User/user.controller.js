import Ride from "../../Model/ride/rideSchema.js";
import User from "../../Model/userPanel/userSchema.js";
import UserLogin from "../../Model/userPanel/userLogin.js";
import { sendAcceptanceRejectionNotificationToCaptain, sendCounterBidNotificationToCaptains } from "../../socket.js";

const UserControllers = {
    acceptRejectRide: async (req,res)=>{
        try {
            const { status,rideId,amount,captainId } = req.body;

            const ride = await Ride.findById(rideId);
            console.log("ride id ==>",rideId);
            console.log("ride details",ride);
            const userId = req.user.id;

            const user = await UserLogin.findById(userId);
            if(!user){
                return res.status(400).json({
                    message:"Invalid user. Can't update fare",
                    success:false
                })
            }
            const userProfile = await User.findOne({phoneNumber:user.phoneNumber});

            if(!ride){
                return res.status(400).json({
                    message:"Invalid ride id",
                    success:false
                })
            }

            if(status!=="Accepted" && status!=="Rejected"){
                return res.status(400).json({
                    message:`Invalid status it should be 'Accepted' or 'Rejected' `,
                    success:false
                })
            }

            if(status==="Accepted"){
                ride.captain_id = captainId;
                ride.rideAmount = amount;
                const updatedRideDetails = await ride.save();
                const payload = {
                    status,
                    captainId,
                    userProfile,
                    updatedRideDetails
                }
                sendAcceptanceRejectionNotificationToCaptain(payload);
            }else if(status==="Rejected"){
                const payload = {
                    status,
                    captainId,
                    userProfile,
                    ride
                }
                sendAcceptanceRejectionNotificationToCaptain(payload);
            }

            res.status(200).json({
                message:`Ride has been ${status}`,
                success:true
            })

        } catch (error) {
            res.status(500).json({
                message:error.message,
                success:false
            })
        }
    },
    updateFareOfRide: async (req,res)=>{
        try {
            const userId = req.user.id;
            const { rideId,amount } = req.body;

            const user = await UserLogin.findById(userId);
            if(!user){
                return res.status(400).json({
                    message:"Invalid user. Can't update fare",
                    success:false
                })
            }
            const userProfile = await User.findOne({phoneNumber:user.phoneNumber});

            const ride = await Ride.findById(rideId);
            if(!ride){
                return res.status(400).json({
                    message:"Invalid ride id",
                    success:false
                })
            }

            if(ride.fare>amount){
                return res.status(400).json({
                    message:`You can't update fare below base price`,
                    success:false
                })
            }
            ride.rideAmount = amount;
            await ride.save();

            

            // send counter bid notification
            sendCounterBidNotificationToCaptains(ride);
            
            res.status(200).json({
                message:"Updated ride amount",
                success:true
            });

        } catch (error) {
            res.status(500).json({
                message:error.message,
                success:false
            })
        }
    }
}

export default UserControllers;