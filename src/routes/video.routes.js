import { Router } from "express";
import {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/getAll").get(getAllVideos);

router.route("/upload").post(verifyJWT, 
    upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }]), 
    publishAVideo);

router.route("/getbyid").get(getVideoById);

router.route("/update/:id").patch(verifyJWT,
  upload.single("thumbnail"),     // for file upoading it is required to inform multer about the type of upload whether it is single or multiple and the name of the field in which file is coming from frontend
  updateVideo);

router.route("/delete/:videoId").post(verifyJWT, deleteVideo);

router.route("/toggle/:videoId").patch(verifyJWT, togglePublishStatus);


export default router;