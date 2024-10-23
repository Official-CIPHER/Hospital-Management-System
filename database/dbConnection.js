import mongoose from "mongoose";

// Connecting the data base with mongodb atlas

export const dbConnection = () => {
  mongoose.connect(process.env.MONGO_URL, {dbName: "HOSPITAL_MANAGEMENT_SYSTEM_DEPLOYED"}).then(()=>{
    console.log("DB Connected !! :)")
  }).catch(err => {
    console.log(`Some Error Occured While Connecting with DATABASE :( : ${err}`)
  })
}