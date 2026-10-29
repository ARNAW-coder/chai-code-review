// this file is just for the purpose of first method of connecting databases to server 
//in which we put all the fucking codes and connection in index.js itself.
//  this is not  a good practice

//codes are given in multiline comments below

//database se kabhibhi connection kro toh problem aa skti hai iske liye "try catch" ka use jaroor kro

//database is always in another continent so use "async await" while connecting
//  to it as connection may take time 

/*   import mongoose from "mongoose";
     import { DB_NAME } from "./constants";  

     import express from "express";
     const app = express();   */

//IIFE function ---- Immediately Invoked Function Expression inhe likhne se pahle ";" lagana 
// chahiye because long code bases me kai baar ye choot jate hain

/*        (async ()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error)=>{
            console.log("Error starting server", error);  //ye wala error express se releated error hai
            throw error;
        })

        app.listen(process.env.PORT, ()=>{
            console.log(`Server started on port ${process.env.PORT}`);
        });
    }
    catch(error){
        console.error("Error connecting to database", error);  //ye wala error database se releated error hai
        throw error;
    }
})();   */
