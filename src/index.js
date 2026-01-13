//database se kabhibhi connection kro toh problem aa skti hai iske liye "try catch" ka use jaroor kro

//database is always in another continent so use "async await" while connecting
//  to it as connection may take time 

import dotenv from "dotenv";   //dotenv ko import kiya hai
//  yaha par taaki environment variables ko access kar ske

//import dotenv from "dotenv";
import connectDB from "./db/index.js";  //database connection function import kiya hai

//dotenv.config({ path: "./env" });  //dotenv ko configure kiya hai yaha par
dotenv.config({ path: "./.env" });



connectDB();  //database connection function call kiya hai yaha par