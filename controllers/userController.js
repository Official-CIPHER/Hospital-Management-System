import { response } from "express";
import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js"
import ErrorHandler from "../middlewares/errorMiddleware.js"
import { User } from "../models/userSchema.js";
import {generateToken} from "../utils/jwtToken.js"
import cloudinary from "cloudinary"


export const patientregister = catchAsyncErrors(async(req,res,next)=>{
  const {firstName, 
    lastName, 
    email, 
    phone, 
    password, 
    gender, 
    dob, 
    nic, 
    role} = req.body;

  // if any think is missing the it check for that
  if(!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic || !role) {
    return next(new ErrorHandler("Please Complete Full Form !", 400))
  }

  // find the user from its email and check in database
  let user = await User.findOne({email});

  if(user) {
    return next(new ErrorHandler("User Already Register!", 400))
  }

  // Create a database entry for storing the user data
  user = await User.create({
    firstName, 
    lastName, 
    email, 
    phone, 
    password, 
    gender, 
    dob, 
    nic, 
    role
  })

// Generate the token for user 
  generateToken(user, "User Register !! ",200,res)

  // res.status(200).json({
  //   success: true,
  //   message: "User Register !! :)",
  // }) // ----- the above line perform the same function
})


// create login user function 
export const login = catchAsyncErrors(async(req,res,next)=>{
  const {email,password,confirmPassword,role} =  req.body;

  if(!email || !password || !confirmPassword || !role){
    return next(new ErrorHandler("Please Complete Full Form !!",400))
  }

  // checking the confirm password 
  if(password !== confirmPassword){
    return next(new ErrorHandler("Password And Confirm Password Do Not Match",400))
  }

  // searching the user with email selecting the field which we made false
  const user = await User.findOne({email}).select("+password");

  if(!user) {
    return next(new ErrorHandler("Invalid Password Or Email",400))
  }

  // Compare the login password with register password if its same the login
  const isPasswordMatch = await user.checkPassword(password)

  if(!isPasswordMatch) {
    return next(new ErrorHandler("Invalid Password Or Email",400))
  }

  if(role !== user.role) {
    return next(new ErrorHandler("User With This role Is Not Found",400))
  }


  // generate token for login
  generateToken(user, `${user.role} LogIn SuccessFully !! `,200,res)

  // res.status(200).json({
  //   success: true,
  //   message: "User Logged In SuccessFully !! :) "
  // })

})


// Add new Admin
export const addNewAdmin = catchAsyncErrors(async(req,res,next)=>{
  // expect the value 
  const {firstName, 
    lastName, 
    email, 
    phone, 
    password, 
    gender, 
    dob, 
    nic,
  } = req.body;

  // we set the exact value to set the admin 

  // if any value is missing the throw error for that
  if(!firstName || 
    !lastName || 
    !email || 
    !phone || 
    !password || 
    !gender || 
    !dob || 
    !nic ) {
    return next(new ErrorHandler("Please Complete Full Form !", 400))
  }


  // check the admin is Already register or not 
  const isRegister = await User.findOne({email});

  if(isRegister) {
    return next(new ErrorHandler(`${isRegister.role} With This EMail Has Already Exist`));
  }

  // if admin not found then create the Admin
  const admin = await User.create({firstName, 
    lastName, 
    email, 
    phone, 
    password, 
    gender, 
    dob, 
    nic,
    role: "Admin",
  });

  res.status(200).json({
    success: true,
    message: "New Admin Register"
  });

})


// Get all the doctor 
export const getAllDoctors = catchAsyncErrors(async(req,res,next)=>{
  // Find the user whose role is "Doctor"
  const doctors = await User.find({role: "Doctor"});
 
  // Send all the doctors in response
  res.status(200).json({
    success: true,
    doctors,
  })
})


// Get User Details 
export const getUserDetails = catchAsyncErrors(async(req,res,next)=>{
  
  // after completing the authentication we get the req.user
  const user = req.user;

  res.status(200).json({
    success: true,
    user,
  })
})



// Logout Admin
export const logoutAdmin = catchAsyncErrors(async(req,res,next)=>{
  res.status(200).cookie("adminToken", "", {
    httpOnly: true,
    expires: new Date(Date.now()),
    secure : true,
    sameSite: "None",
  }).json({
    success:true,
    message: "Admin Logged Out SuccessFully !!"
  })
})


// Logout Patient
export const logoutPatient = catchAsyncErrors(async(req,res,next)=>{
  res.status(200).cookie("patientToken", "", {
    httpOnly: true,
    expires: new Date(Date.now()),
    secure : true,
    sameSite: "None",
  }).json({
    success:true,
    message: "Patient Logged Out SuccessFully !!"
  })
})


// Add New Doctor
export const addNewDoctor = catchAsyncErrors(async(req,res,next)=>{
  // Check the doctor avatar file if its not available then throw error
  if(!req.files || Object.keys(req.files).length === 0){
    return next(new ErrorHandler("Doctor Avatar Required !", 400));
  }

  // Make sure you use same name in frontend part as you mentioned here
  const {docAvatar} = req.files;

  // types of format that you accept for uploading files
  const allowedFormats = ["image/png","image/jpeg","image/webp"]

  // checks the file type of docavtar if its not match then throw error
  if(!allowedFormats.includes(docAvatar.mimetype)){
    return next(new ErrorHandler("File Format Not Supported !", 400))
  }

  // get details about doctor from the form
  const {
    firstName, 
    lastName, 
    email, 
    phone, 
    password, 
    gender, 
    dob, 
    nic,
    doctorDepartment
  } = req.body;

  // if User not fill any of details then throw error
  if(
    !firstName || 
    !lastName || 
    !email || 
    !phone || 
    !password || 
    !gender || 
    !dob || 
    !nic ||
    !doctorDepartment ||
    !docAvatar
  ) {
    return next(new ErrorHandler("Please Provide Complete Details !!",400))
  }

  // Check that doctor Already exist or not
  const isDoctorRegistered = await User.findOne({email});

  // if exists then throw error
  if(isDoctorRegistered){
    return next(new ErrorHandler(`${isDoctorRegistered.role} already registered with this email !!`,400))
  }

  
  // ------ Upload Images on Cloudinary ///////
  const cloudinaryResponse = await cloudinary.uploader.upload(docAvatar.tempFilePath)

  // if cloudinaryResponse is not responsing
  if(!cloudinaryResponse || cloudinaryResponse.error) {
    console.error("Cloudinary Error: ", cloudinaryResponse.error || "Unknown Cloudinary Error");
    return next(
      new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500)
    );

  }


  // Create Doctor in database and Static the role which is Doctor
  //docAvatar - It is Object which contain public id and url of Image
  const doctor = await User.create({
    firstName, 
    lastName, 
    email, 
    phone, 
    password, 
    gender, 
    dob, 
    nic,
    doctorDepartment,
    role: "Doctor",
    docAvatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    }
  })

  res.status(200).json({
    success: true,
    message: "New Doctor Register !! ",
    doctor
  })

})