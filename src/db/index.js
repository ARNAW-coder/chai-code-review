import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {
    try{
        const connectionInstance =await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoDB connected !! DB HOST : ${connectionInstance.connection.host}`);
    }
    catch(error){
        console.error("Error connecting to database", error);  //ye wala error database se releated error hai
        process.exit(1);   //node process hai ye
    }
} 


export default connectDB;