import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUsercoverImage,
  getUserChannelProfile,
  getWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

console.log("routes.js reloaded");

const router = Router();

router.route("/register").post(
  upload.fields([
    // ye middleware hai jo bolta hai "jaane se pahle mil ke jaana"
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  (req, res, next) => {
    console.log("Body:", req.body); // text fields
    console.log("Files:", req.files); // uploaded files
    next(); // pass control to registerUser
  },
  registerUser
); //app.js se aane ke baad url aise bnta hai "/users/register" ye hone ke baad registerUser function run ho jata ahi
// router.route("./login").post(login)

router.route("/login").post((req, res, next) => {
  console.log("body :", req.body);
  next();
}, loginUser);

// secured routes
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

router
  .route("/cover-image")
  .patch(verifyJWT, upload.single("coverImage"), updateUsercoverImage);

router.route("/c/:username").get(verifyJWT, getUserChannelProfile);

router.route("/history").get(verifyJWT, getWatchHistory);



export default router;
