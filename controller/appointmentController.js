import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js"
import ErrorHandler from "../middlewares/errorMiddleware.js"

// Database importing 
import {Appointment} from "../models/appointmentSchema.js"
import {User} from "../models/userSchema.js"

export const postAppointment = catchAsyncErrors(async(req,res,next)=>{
  
  // get these data from the form
  const { 
    firstName, 
    lastName, 
    email, 
    phone,
    gender, 
    dob, 
    nic,
    appointment_Date,
    department,
    doctor_firstName,
    doctor_lastName,
    hasVisited,
    address
  } = req.body;

  // if the data is not found then throw error
  if(
    !firstName || 
    !lastName ||
    !email || 
    !phone ||
    !gender || 
    !dob || 
    !nic ||
    !appointment_Date ||
    !department ||
    !doctor_firstName ||
    !doctor_lastName ||
    !address
  ){
    return next(new ErrorHandler("Please Provide Complete Details !!",400))
  }

  // When same name doctor conflict which means if patient appoint doctor and 
  // if there is 2 doctor with same name then which doctor has patient appointed
  const isConflict = await User.find({
    firstName: doctor_firstName,
    lastName: doctor_lastName,
    role: "Doctor",
    doctorDepartment: department
  })

  // If Doctor is not available with that name then throw error
  if(isConflict.length === 0) {
    return next(new ErrorHandler("Doctor not found !!", 400))
  }

  // If doctor found with same name the throw error
  if(isConflict.length > 1){
    return next(new ErrorHandler("Doctors Conflict ! Please Contact Through Email or Phone !", 404))
  }


  // Get doctor Id
  const doctorId = isConflict[0]._id;

  // Get Patient id from authentized patient from the data
  const patientId = req.user._id;

  // Create Databace entry for the appointment data
  const appointment = await Appointment.create({
    firstName, 
    lastName, 
    email, 
    phone,
    gender, 
    dob, 
    nic,
    appointment_Date,
    department,
    doctor : {
      firstName: doctor_firstName,
      lastName: doctor_lastName,
    },
    hasVisited,
    address,
    doctorId,
    patientId
  })

  // send the response
  res.status(200).json({
    success: true,
    message: "Appointment Sent SuccessFully !!",
    appointment,
  })

})


// Get all Appointment 
export const getAllAppointment = catchAsyncErrors(async(req,res,next)=>{
  const appointments = await Appointment.find();

  res.status(200).json({
    success: true,
    appointments
  })
})


// Update appointment status
export const updateAppointmentStatus = catchAsyncErrors(async(req,res,next)=>{
  
  // get the id from the route
  const { id } = req.params;

  // find the patient with that id
  let appointment = await Appointment.findById(id);

  // check the appointment 
  if(!appointment) {
    return next(new ErrorHandler("Appointment Not Found !!", 404));
  }

  // update the appointment by its id 
  appointment = await Appointment.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: " Appointment Status Updated !!",
    appointment,
  });

})


// Delete the appointment
export const deleteAppointment = catchAsyncErrors(async(req,res,next)=>{
  const {id} = req.params;

  let appointment = await Appointment.findById(id);

  if(!appointment) {
    return next(new ErrorHandler("Appointment Not Found !!", 404));
  }

  // delete that appointment
  await appointment.deleteOne();

  res.status(200).json({
    success: true,
    message: "Appointment Deleted SuccessFully !!"
  })

})