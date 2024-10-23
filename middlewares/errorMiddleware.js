// This middlewares handle error message 

// this class extends error class which includes error features to handle the errors
class ErrorHandler extends Error {
  // constructor 
  constructor(message, statusCode) {
    super(message); 
    this.statusCode = statusCode;
  }
}

// this is the export file in which we add err with other parameter and if message and statusCode not exist then we use 
// our hardcore error to understand the error in which part of the code
  
export const errorMiddleware = (err,req,res,next) => {
  err.message = err.message || "Internal Server Error (Inside ErrorMiddleware) :(";
  err.statusCode = err.statusCode || 500;

  // Error message for Duplicate data exist (for example same email)
  // Object.keys(err.keyValue) - get the error key value
  if(err.code === 11000){
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  // JSON WEB TOKEN Error - handle web token related error
  if(err.name === "JsonWebTokenError"){
    const message = "Json Web Token is invalid , TRY AGAIN !";
    err = new ErrorHandler(message, 400);
  }

  // Token Expired Error - If your token expired then this error throw
  if(err.name === "TokenExpiredError") {
    const message = "Json Web Token is Expired , TRY AGAIN !"
    err = new ErrorHandler(message, 400);
  }

  // Cast Error -  Mongoose could not convert a value to the type defined in the schema path.
  // Enter Wrong data or if type not match or validation error
  if(err.name === "CastError") {
    const message = `Invalid ${err.path}`
    err = new ErrorHandler(message, 400);
  }

  // Code for only getting the error not extra value
  const errorMessage = err.errors ? Object.values(err.errors).map(error => error.message).join(" ") : err.message;



  return res.status(err.statusCode).json({
    success: false,
    message: errorMessage,
  })

}


export default ErrorHandler;