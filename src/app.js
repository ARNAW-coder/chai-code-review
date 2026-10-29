import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

const app = express();

// 'app.use' ham middleware ko use karne ke liye karte hain.....
dotenv.config({ path: "./.env" });
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // CORS_ORIGIN ye btata hai kis frontend se request aayegi ,
    // agar ise * ke equal kre toh sbhi frontend se request aayegi
    credentials: true,
  })
); //ye middleware ko access ke liye

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(express.static("public")); //static files ko serve karne ke liye
app.use(cookieParser()); //cookie parser middleware ko use karne ke liye

//routes ko import krenge......

import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import commentRouter from "./routes/comment.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import likeRouter from "./routes/like.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import healthcheckRouter from "./routes/healthcheck.routes.js";

//routes declaration

app.use("/api/v1/users", userRouter); //ye middleware hame enable krta hai when we visit localhost:PORT/    users pe toh ye hme userRouter pe shift krta hai and userRouter phir hme uske hisab se work krata hai      [ "/api/v1/users"---->  ye standard practice hai ]

app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/playlists", playlistRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/dashboards", dashboardRouter);
app.use("/api/v1/healthcheck",healthcheckRouter);


export { app }; 
