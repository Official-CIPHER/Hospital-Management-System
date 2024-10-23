import express from "express";
import { getAllMessages, sendMessage } from "../controllers/messageController.js";
import {isAdminAuthentication} from "../middlewares/auth.js"


// Create instant of router 
const router = express.Router();

// Creating post request for send and write function that handle this send request
router.post("/send",sendMessage);

// Admin have the access to read the message 
router.get("/getall",isAdminAuthentication, getAllMessages)


export default router;