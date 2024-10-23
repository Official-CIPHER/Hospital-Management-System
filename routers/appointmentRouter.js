import express from "express";
import { deleteAppointment, getAllAppointment, postAppointment, updateAppointmentStatus } from "../controllers/appointmentController.js";
import {isAdminAuthentication, isPatientAuthentication} from "../middlewares/auth.js"

const router = express.Router();

// Post Request for appointment by patients
router.post("/post",isPatientAuthentication ,postAppointment)

// Get Request to see all appointment by Admin
router.get("/getall",isAdminAuthentication, getAllAppointment)


// Put Request to update the status of the Request and only admin update the status
router.put("/update/:id", isAdminAuthentication, updateAppointmentStatus)


// Delete Request to delete the patient appointment
router.delete("/delete/:id", isAdminAuthentication, deleteAppointment);

export default router;