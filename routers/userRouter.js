import express from "express"
import { addNewAdmin, addNewDoctor, getAllDoctors, getUserDetails, login, logoutAdmin, logoutPatient, patientregister } from "../controllers/userController.js";
import {isAdminAuthentication, isPatientAuthentication} from "../middlewares/auth.js"
import { User } from "../models/userSchema.js";


const router =  express.Router();

// Post Requests
router.post("/patient/register", patientregister); // For patient register
router.post("/login", login); // For login 
router.post("/admin/addnew", isAdminAuthentication ,addNewAdmin); // For admin register

// Get Requests
router.get("/doctors", getAllDoctors); // Get all the doctors
router.get("/admin/me",isAdminAuthentication ,getUserDetails)
router.get("/patient/me",isPatientAuthentication ,getUserDetails)
router.get("/admin/logout",isAdminAuthentication ,logoutAdmin)
router.get("/patient/logout",isPatientAuthentication ,logoutPatient)


// Post Requests
router.post("/doctor/addnew", isAdminAuthentication, addNewDoctor)

// delete doctor
router.delete("/api/v1/user/doctor/delete/:id", async (req, res) => {
 try {
   const { id } = req.params;
 
   let doctor = await User.findById(id);
 
   if(!doctor) {
     return next(new ErrorHandler("Doctor Not Found !!", 404));
   }
 
   // delete that doctor
   await doctor.deleteOne();
 
   res.status(200).json({
     success: true,
     message: "Doctor Deleted SuccessFully !!"
   })
 } catch (error) {
  console.log("Error happened at backend While delete the doctor")
 }
});


export default router;