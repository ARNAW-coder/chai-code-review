import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
   /* const {channelId} = req.params;
    if(!channelId){
        return res.status(400)
        .json(new ApiError(400,null,"channel id is missing"))
    }
    const videos = await Video.aggregate([
        {
            $match:{
                owner:new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $count:"videosCount"
        }
    ])*/
  
     const {username} = req.params;

     if(!username){
        return res.status(400).json(
            new ApiError(400, null, "error while getting username")
        )
     }

    const userowner = await User.findOne({
        username
    })

    console.log(userowner);

    if(!userowner){
        return res.status(404).json(
            new ApiError(404, null, "userowner not found")
        )
     }
     
     const subscribersCount = await Subscription.countDocuments(
        {channel:userowner._id}
     )
     

     if(!subscribersCount){
        return res.status(500).json(
            new ApiError(500, null, "server error while finding subscribers count")
        )
     }

     const videosCount = await Video.countDocuments(
        {owner: userowner._id}
     )
     console.log(videosCount);
     
     if(!videosCount){
        return res.status(500).json(
            new ApiError(500, null, "server error while finding videos count")
        )
     }
     
     const likesCount = await Video.aggregate([
        {
            $match:{
                 owner: userowner._id
        }
        },
        {
            $lookup:{
                from:"likes",
                localField:"_id",
                foreignField:"video",
                as:"likedVideos",
            }
        },
        {
            $project:{
                likesCount: { $size: "$likedVideos" }
            }
        },
        {
            $group:{
                _id:null,
                 totalLikes: { $sum: "$likesCount" }
            }
        }
     ]
        
     )

     
     if(!likesCount){
        return res.status(500).json(
            new ApiError(500, null, "server error while finding likes count")
        )
     }
     
     const viewsCount = await Video.aggregate([
        {
            $match:{
                owner: userowner._id
            }
        },
        {
            $group:{
                _id:null,
                totalviews:{ $sum :"$views"}
            }
        }
     ])

     
     if(!viewsCount){
        return res.status(500).json(
            new ApiError(500, null, "server error while finding views count")
        )
     }
     
     const results = {
        subscribersCount,
        videosCount,
        likesCount,
        viewsCount,

     }
     
     return res.status(200).json(
        new ApiResponse(
            200, results, "stats fetched successfully"
        )
     )
    
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const {username} = req.params

    if(!username){
        return res.status(400)
          .json(new ApiError(400, null, "username missing"))

    }

    const userOwner = await User.findOne({
        username
    })

    if(!userOwner){
        return res.status(404)
          .json(new ApiError(404, null, "userowner not found"))

    }
    const videos = await Video.find(
        {owner: userOwner._id}
    )
    if(videos.length===0){
        return res.status(404)
        .json(404,null,"videos not found")
    }

    return res.status(200).
    json(new ApiResponse(200, videos, "videos fetched successfully" ))
})

export {
    getChannelStats, 
    getChannelVideos
    }