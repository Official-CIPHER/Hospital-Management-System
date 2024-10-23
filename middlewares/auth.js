// This is the file which gives the authentication for adding the new admin so that only admin has permission to add another admin none of other can add new admin

import jwt from "jsonwebtoken";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./errorMiddleware.js";
import { User } from "../models/userSchema.js";

// Authenticated and Authorization Code for Admin
export const isAdminAuthentication = catchAsyncErrors(async(req,res,next)=>{
  // Find the token (get the token)
  const token = req.cookies.adminToken;

  // If token is not found
  if(!token) {
    return next(new ErrorHandler("Admin Not Authenticated !", 400));
  }

  // Verifying work is done here
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // Get the id of token of admin
  req.user = await User.findById(decoded.id)

  // if user role is not for Admin then throw error
  // Authentication and Authorization
  if(req.user.role !== "Admin") {
    return next(new ErrorHandler(`${req.user.role} is not Authorized for this resources !`,403));
  }

  next();
})


// Authenticated and Authorization Code for Patient
export const isPatientAuthentication = catchAsyncErrors(async(req,res,next)=>{
  // Find the token (get the token)
  const token = req.cookies.patientToken;

  // If token is not found
  if(!token) {
    return next(new ErrorHandler("Patient Not Authenticated !", 400));
  }

  // Verifying work is done here
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // Get the id of token of admin
  req.user = await User.findById(decoded.id)

  // if user role is not for Admin then throw error
  // Authentication and Authorization
  if(req.user.role !== "Patient") {
    return next(new ErrorHandler(`${req.user.role} is not Authorized for this resources !`,403));
  }

  next();
})