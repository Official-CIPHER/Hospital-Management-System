import express from "express";
import {config} from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { dbConnection } from "./database/dbConnection.js";
import messageRouter from "./routers/messageRouter.js"
import {errorMiddleware} from "./middlewares/errorMiddleware.js"
import userRouter from "./routers/userRouter.js"
import appointmentRouter from "./routers/appointmentRouter.js"

// configuration of dotenv file for using important data
const app = express();
config({path:"./config/config.env"})

//Middlewares
//1.Middleware - CORS handle the cors error and others
app.use(cors({
  origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}))

// 2.Middleware - COOKIE_PARSER to get the cookies
app.use(cookieParser());

// 3. Middleware - Express.json for parser the json data as a string
app.use(express.json());

// 4.Middleware - Express.urlencoded to handle the url data 
app.use(express.urlencoded({extended: true}));

// 5.Middleware - fileUpload for uploading the file
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/temp/"
}))


// Routers 
// 1. Router - Message route for messages
app.use("/api/v1/message",messageRouter);

// 2. Router - Register the user
app.use("/api/v1/user", userRouter)

// 3. Router - Appointment by patient
app.use("/api/v1/appointment",appointmentRouter)


// Connecting DB 
dbConnection();




// 6. Middleware - Error middleware for handling the error
app.use(errorMiddleware)
export default app;