import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server } from "socket.io";

// ✅ Import your socket setup function
import { initSocket, setupSocket } from "./socket.js";  // ⬅️ Make sure the path is correct

// Your route imports
import { userRouter } from "./Routes/UserRoutes/LoginUser.js";
import { router } from "./Routes/UserRoutes/Captain.js";
import { rideRouter } from "./Routes/UserRoutes/rides.js";
import adminRoute from './Routes/adminRoutes/adminRoutes.js'
import { AdminControllers } from "./controller/adminController/admin.controller.js";
import commonRoutes from "./Routes/commonRoutes/common.routes.js";

// Initialize Express
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api/uploads", express.static("Uploads"));

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',  // ✅ For production, specify your frontend domain
    methods: ["GET", "POST"],
  }
});

// Initialize socket handling
setupSocket(io);
initSocket(io);

// Connect to MongoDB
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((error) => {
    console.log("❌ Error connecting to MongoDB:", error.message);
  });

// Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/captain", router);
app.use("/api/v1/ride", rideRouter);
app.use("/api/v1/admin",adminRoute);
app.use('/api/v1/commonRoutes',commonRoutes)

AdminControllers.createDefaultAdmin();
// Start the server
const port = process.env.PORT || 5000;  // ✅ Added fallback port
server.listen(port, () => {
  console.log(`🚀 Server started on PORT ${port}`);
});
