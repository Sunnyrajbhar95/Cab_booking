// import DlSchema from "../../Model/captainPannel/dlschema.js";
// import AdModel from "../../Model/captainPannel/adharSchema.js";
// import Pan from "../../Model/captainPannel/panSchema.js";
// import RcModel from "../../Model/captainPannel/rcSchema.js";
// import InsModel from "../../Model/captainPannel/insuranceSchema.js";
// import Permit from "../../Model/captainPannel/vehicalPermit.js";
// import Profile from "../../Model/captainPannel/profile.js";

// export const dl = async (req, res) => {
//   try {
//     if (!req.files || req.files.length !== 2) {
//       return res.status(400).json({
//         success:false,
//         message: "At least two image is required.",
//       });
//     }
//     const { id } = req.params;
//     const { number, dob } = req.body;
//     if (!number || !dob || !id) {
//       return res.status(400).json({
//         message: "Missing data",
//       });
//     }
//     const images = req.files.map((file) => file.filename);
//     const profile = await Profile.findById(id);
//     if (!profile) {
//       return res.status(401).json({
//         message: "captain profile does not exist",
//       });
//     }
//     const doc = await DlSchema.create({
//       number,
//       dob,
//       front_url: images[0],
//       backend_url: images[1],
//     });
//     profile.license = doc.id;
//     await profile.save();
//     return res.status(200).json({
//       doc,
//       success: true,
//     });
//   } catch (err) {
//     console.log(err);
//     return res.status(401).json({
//       success: false,
//       error: err,
//     });
//   }
// };

// export const Adharuplaod = async (req, res) => {
//   try {
//     if (!req.files || req.files.length !== 0) {
//       return res
//         .status(400)
//         .json({ message: "At least one image is required." });
//     }
//     const { id } = req.params;
//     const { number } = req.body;
//     if (!number) {
//       return res.status(400).json({
//         success:false,
//         message: "Missing  data",
//       });
//     }
//     const images = req.files.map((file) => file.filename);
//     const profile = await Profile.findById(id);
//     if (!profile) {
//       return res.status(404).json({
//         success:false,
//         message: "Profile does not exist",
//       });
//     }
//     const doc = await AdModel.create({
//       number,
//       front_url: images[0],
//       backend_url: images[1],
//     });
//     profile.adhar = doc.id;
//     await profile.save();
//     return res.status(200).json({
//       doc,
//       success: true,
//     });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({
//       success: false,
//       error: err.message,
//     });
//   }
// };

// export const PanUpload = async (req, res) => {
//   try {
//     if (!req.files || req.files.length === 0) {
//       return res
//         .status(400)
//         .json({ message: "At least one image is required." });
//     }
//     const { id } = req.params;
//     const { number } = req.body;
//     if (!number) {
//       return res.status(400).json({
//         success:false,
//         message: "Missing data",
//       });
//     }

//     const images = req.files.map((file) => file.filename);

//     const profile = await Profile.findById(id);
//     if (!profile) {
//       return res.status(404).json({
//         success:false,
//         message: "Profile does not exist",
//       });
//     }
//     const doc = await Pan.create({
//       number,
//       front_url: images[0],
//     });

//     profile.pancard = doc.id;
//     await profile.save();
//     return res.status(200).json({
//       doc,
//       success: true,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       error: err.message,
//     });
//   }
// };

// export const Rcupload = async (req, res) => {
//   try {
//     if (!req.files || req.files.length === 0) {
//       return res
//         .status(400)
//         .json({success:false, message: "At least one image is required." });
//     }
//     const { id } = req.params;
//     const images = req.files.map((file) => file.filename);
//     const profile = await Profile.findById(id);
//     if (!profile) {
//       return res.status(404).json({
//         success:false,
//         message: "Profile does not exist",
//       });
//     }
//     const doc = await RcModel.create({
//       front_url: images[0],
//     });
//     profile.rc = doc.id;
//     await profile.save();
//     return res.status(200).json({
//       doc,
//       success: true,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       error: err.message,
//     });
//   }
// };

// export const InsUpload = async (req, res) => {
//   try {
//     if (!req.files || req.files.length === 0) {
//       return res
//         .status(400)
//         .json({ success:false, message: "At least one image is required." });
//     }
//     const { id } = req.params;

//     const images = req.files.map((file) => file.filename);
//     const profile = await Profile.findById(id);
//     if (!profile) {
//       return res.status(404).json({
//         success:false,
//         message: "Profile does not exist",
//       });
//     }

//     const doc = await InsModel.create({
//       front_url: images[0],
//     });
//     profile.insurance = doc.id;
//     await profile.save();
//     return res.status(200).json({
//       doc,
//       success: true,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       error: err.message,
//     });
//   }
// };

// export const PermitUplaod = async (req, res) => {
//   try {
//     if (!req.files || req.files.length === 0) {
//       return res
//         .status(400)
//         .json({ success:false,message: "At least one image is required." });
//     }
//     const { id } = req.params;

//     const images = req.files.map((file) => file.filename);

//     const profile = await Profile.findById(id);
//     if (!profile) {
//       return res.status(404).json({
//         message: "Profile does not exist",
//       });
//     }
//     const doc = await Permit.create({
//       front_url: images[0],
//     });

//     profile.permit = doc.id;
//     await profile.save();
//     return res.status(200).json({
//       doc,
//       success: true,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       error: err.message,
//     });
//   }
// };
