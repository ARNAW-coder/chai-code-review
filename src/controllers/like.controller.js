import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {Video} from "../models/video.model.js"
import {Comment} from "../models/comment.model.js"
import {Tweet} from "../models/tweet.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on video
    const {videoId} = req.params
    
    const likedBy = req.user._id;

    const check = await Video.findById(videoId);
    if(!check){
        return res.status(404).json(
            new ApiError(404, null, "no video found regarding the videoid")
        )
    }

    if(!videoId || !likedBy){
        return res.status(400)
             .json(
                new ApiError(400, null,"MISSING VIDEOID")
             )
    }

    const alreadyLiked = await Like.findOne({
        video:videoId,
        likedBy: likedBy,
    })

    console.log(alreadyLiked);
    
    if(alreadyLiked){
        const deletedlike = await Like.findByIdAndDelete(alreadyLiked._id)

        return res.status(200).json(
            new ApiResponse(200,deletedlike,"like removed from video successfully")
        )
    }
 
    const like = await Like.create({
            video:videoId,
            likedBy,})
    
            if(!like){
                return res.status(500).json(
                    new ApiResponse(500,"error while creating like to the video")
                )
            }
    
    return res.status(201).json(
        new ApiResponse(200, like, "like created successfully")
    )        


})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params;
    //TODO: toggle like on comment
    const likedBy = req.user._id;

    const check = await Comment.findById(commentId);
    if(!check){
        return res.status(404).json(
            new ApiError(404, null, "no comment found regarding the commentid")
        )
    }

    if(!commentId || !likedBy){
        return res.status(400)
             .json(
                new ApiError(400,null, "MISSING commentid or likedby")
             )
    }

    const alreadyLiked = await Like.findOne({
        comment:commentId,
        likedBy,
    })

    if(alreadyLiked){
        await Like.findByIdAndDelete(alreadyLiked._id)

        return res.status(200).json(
            new ApiResponse(200,alreadyLiked,"like removed from comment successfully")
        )
    }
 
    const like = await Like.create({
            comment:commentId,
            likedBy,})
    
            if(!like){
                return res.status(500).json(
                    new ApiResponse(500,null,"error while creating like to the comment")
                )
            }
    
    return res.status(201).json(
        new ApiResponse(200, like, "like created successfully")
    )        


})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    const likedBy = req.user._id;

    const check = await Tweet.findById(tweetId);
    if(!check){
        return res.status(404).json(
            new ApiError(404, null, "no tweet found regarding the tweetid")
        )
    }

    if(!tweetId || !likedBy){
        return res.status(400)
             .json(
                new ApiError(400, null,"MISSING tweetid or likedby")
             )
    }

    const alreadyLiked = await Like.findOne({
        tweet:tweetId,
        likedBy,
    })

    if(alreadyLiked){
        await Like.findByIdAndDelete(alreadyLiked._id)

        return res.status(200).json(
            new ApiResponse(200,alreadyLiked,"like removed from tweet successfully")
        )
    }
 
    const like = await Like.create({
            tweet:tweetId,
            likedBy,})
    
            if(!like){
                return res.status(500).json(
                    new ApiResponse(500,null,"error while creating like to the tweet")
                )
            }
    
    return res.status(201).json(
        new ApiResponse(200, like, "like created successfully")
    )        
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const likedVideos = await Like.aggregate([
        {$match:{likedBy:new mongoose.Types.ObjectId(req.user._id)}},
        {$lookup:{
            from:"videos",
            localField:"video",
            foreignField:"_id",
            as:"videos"
        }
        },
        {$unwind: "$videos"},  // convert array to object
        {$replaceRoot:{newRoot: "$videos" }}  // return only video data
    ])

    if(!likedVideos){
        return res.status(400).json(
            new ApiError(400,null, "error while finding liked videos")
        )
    }
    
    return res.status(200).json(
        new ApiResponse(200, likedVideos, "likedVideos fetched successfully")
    )
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}