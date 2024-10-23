import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js"
import {Message} from "../models/messageSchema.js"
import ErrorHandler from "../middlewares/errorMiddleware.js"


// Message for filling the from 
export const sendMessage = catchAsyncErrors(async(req,res,next) => {
  const {firstName, lastName, email, phone, message} = req.body;
  if(!firstName || !lastName || !email || !phone || !message){
    return next(new ErrorHandler("Please Fill Complete Form !", 400))
  }
  await Message.create({firstName, lastName, email, phone, message});
  res.status(200).json({
      success: true,
      message: "Message Send SuccessFully !! "
  });
}
)


// Get all messages
export const getAllMessages = catchAsyncErrors(async(req,res,next)=>{
  // find the message from the database
  const messages = await Message.find();

  // response Send
  res.status(200).json({
    success: true,
    messages
  })

})