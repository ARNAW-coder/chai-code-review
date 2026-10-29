import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { v2 as cloudinary } from "cloudinary";

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    
    const pipeline = [];   // ye hai empty bowl.......

    // filter by search query(title or description)   // niche hai ingredients jo ki ham empty bowl me dalenge....
                                                    //most important pahle bowl lenge tabhi usme ingredient daal payenge and then tabhi use ham chef ko denge banane ke liye...
    if(query){
        pipeline.push({
            $match:{$or:[
                    {title: {$regex: query, $options: "i"}},{description:{$regex: query, $options: "i"}}
                        ]}
        });
    }

    if(userId){
        pipeline.push({
            $match:{
                owner: new mongoose.Types.ObjectId(userId)
            }
        })
    }
 
    // 3. Sorting logic
    
    const sortField = sortBy || "createdAt";
    let sortOrder; 
    if(sortType === "asc"){
        sortOrder = 1}// if sortType is asc(ascending) give 1(old to new) else give -1(new to old)
    else{
        sortOrder = -1
    }
    console.log(sortField, sortOrder)
    pipeline.push({
        $sort: { [sortField]: sortOrder }    // $sort arranges the data according to given inputs in {hsacdgdhc}
    });
 
    // 4. Join with User collection to get owner details (optional but recommended)
    pipeline.push({
        $lookup:{
            from:"users", 
            localField:"owner",
            foreignField:"_id",
            as:"owner",
            pipeline:[
                {$project:{ username:1, avatar:1, fullName:1 }}
            ]
        }
        
    },{
            $addFields:{
                owner:{ $first: "$owner"}
            }
        })

    // 5. Execute with Pagination

    const videoAggregate = Video.aggregate(pipeline)   // ye hai hmare chef bhiaya......
    
    const options = {     // khana banne ke baad parosna kaise hai vo option bhaia decide krte hain...

        page: parseInt(page, 10),    // (page, 10) yha page to query se aata hai aur ",10" number ka base batata hai yani yha pe decimal
        limit: parseInt(limit, 10),  // (limit, 10) yha limit to query se aata hai aur ",10" number ka base batata hai yani yha pe decimal 
    }

    const videos = await Video.aggregatePaginate(videoAggregate, options)
    
    if (!videos || videos.docs.length === 0) {   
        return res.status(200).json(new ApiResponse(200, [], "No videos found"));
    }  // "videos.docs" is the array of all the videos......

    return res.status(200).json(
        new ApiResponse(200, videos, "Videos fetched successfully")
    );
     
})
  
const publishAVideo = asyncHandler(async (req, res) => {
    // TODO: get video, upload to cloudinary, create video
    

    
    
    const { title, description} = req.body || {};
    console.log(title)
    const videoLocalPath = req.files?.["videoFile"]?.[0]?.path;
    const thumbnailLocalPath = req.files?.["thumbnail"]?.[0]?.path;  /*   beaware to make router.route("/upload").post(
                                                  upload.fields([
                                                                 { name: "video", maxCount: 1 },
                                                                 { name: "thumbnail", maxCount: 1 }
                                                                ]),uploadVideo);  */
    
                                                                
    console.log(videoLocalPath)

    if([title, description , videoLocalPath, thumbnailLocalPath].some((field) => field.trim()==="")) {
        throw new ApiError(400, null,"local path credentials for uploading vidoes not found")
    }
    
    const video = await uploadOnCloudinary(videoLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);


    if(!video.url){
        new ApiError(404, "your video is not uploaded on cloudinary")
    }

    if(!thumbnail.url){
        new ApiError(404, "your thumbnail is not uploaded on cloudinary")
    }

    
    

    const publishedVideo = await Video.create({
         title,
         description,
         videoFile: video.url,
         thumbnail: thumbnail.url,
         duration:video.duration,
         owner:req.user._id,
    })

    console.log(publishedVideo)

    if(!publishedVideo){
        return new ApiError(400, "published video is not found")
    }

    return res.status(200).json(new ApiResponse(200, publishedVideo, "VIDEO UPLOADED SUCCESSFULLY")) 

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.query
    //TODO: get video by id

    if(!videoId){
        return new ApiError(404,null, "videoid not found")
    }

    const video = await Video.findByIdAndUpdate(
  videoId,
  { $inc: { views: 1 } },   // increment safely
  { new: true },                  // return updated document
);

    if(!video){
        return res.status(500).json(new ApiError(500,null, "error while finding the vidoe"))
    }

    return res.status(200).json(
        new ApiResponse(200, video, "video got by id successfully")
    )
})

const updateVideo = asyncHandler(async (req, res) => {
    const videoId  = req.params.id;
    //TODO: update video details like title, description, thumbnail
    console.log(videoId)
    const {title, description} = req.body;
    console.log(title, description)
    const thumbnailLocalPath = req.file?.path;

    if(!thumbnailLocalPath){
        return new ApiError(404, "thumbnail local file not found")
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if(!thumbnail.url){
        return new ApiError(500, "ERROR WHILE UPLOADING VIDEOS ON CLOUDINARY WHILE UPDATING")
    }

    const video = await Video.findOneAndUpdate(
        {videoId,
            owner:req.user._id,
        },
        {
            $set:{
                title,
                description,
                thumbnail:thumbnail.url,
            }
        },
        {new:true}
    )

    if(!video){
        return new ApiError(500," video not found")
    }

    return res.status(200).json(
        new ApiResponse(200, video, "video updated successfully")
    )


})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    const video = await Video.findOne({videoId,
        owner:req.user._id,
    });

    if(!video){
        return new ApiError(
            400, "video not found "
        )
    }

    // 2. Delete from Cloudinary (assuming you use a utility function)
    // You'll need the public_id of the video and thumbnail

    if(video.videoFile){
                await cloudinary.uploader.destroy(video.videoFile, {
                    resource_type: "video"
                })
    }
    
    if(video.thumbnail){
                await cloudinary.uploader.destroy(video.thumbnail, {
                    resource_type: "image"
                })
    }

    
    
    await video.deleteOne();  // ye method hamne video model me banaya hai jisme video ko delete krne ke sath sath uske reference ko user ke videos array se bhi delete krna hai....

    return res.status(200).json(
        new ApiResponse(200, null,"video deleted successfully")
    )
})

const togglePublishStatus = asyncHandler(async (req, res) => {   // it performs logical not operation.....
    const { videoId } = req.params

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // 2. Toggle the status
    // This flips true to false or false to true
    video.isPublished = !video.isPublished;

    // 3. Save the changes
    await video.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200, 
                { isPublished: video.isPublished }, 
                "Publish status toggled successfully"
            )
        );
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}