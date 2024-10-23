// generating token for user authentication and authorization that why Token is required

export const generateToken = (user, message , statusCode , res) => {
  // generate tokens
  const token = user.generateJsonWebToken();
  
  // give the name to the cookie either admin or patient
  const cookieName = user.role === "Admin" ? "adminToken" : "patientToken";

  res.status(statusCode).cookie(cookieName,token,{
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,
    sameSite: "None"
  }).json({
    success: true,
    message,
    user,
    token,
  })

}