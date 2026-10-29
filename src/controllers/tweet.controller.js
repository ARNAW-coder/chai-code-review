import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body || {};

    if(!content){
        return res.status(400).json(
            new ApiResponse(400, "tweet content is required")
        )        
    }

    const tweet = await Tweet.create({
        content,
        owner:req.user._id,
    })

    if(!tweet){
        return res.status(500).json(new ApiError
            (
                500, "error while creating tweet"
            )
        )
    }

    return res.status(201).json(new ApiResponse(201, tweet, "tweet created successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId} = req.params;
        const page = Math.max(Number(req.query.page) || 1,1);
        const limit = Math.max(Number(req.query.limit) || 10,1);
    
        if(!userId){
            return res.status(400).json(
                new ApiError(400, "userId is required")
            );
        }
    
        const tweets = await Tweet.find(
            {owner: userId}
        ).sort({createdAt:-1})
        .skip((page-1)*limit)
        .limit(limit);
        
        return res.status(200).json(
            new ApiResponse(200, tweets, "tweets fetched successfully")
        )
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId} = req.params;
        const {content} = req.body;
    
        if(!tweetId || !content){
            return res.status(400).json(
                new ApiError(400, "tweetId or content is required")
            )
        }
    
        const tweet = await Tweet.findByIdAndUpdate(
            tweetId,
            {
                $set:{content}            
            },
            {new:true}
        )
    
        if(!tweet){
            return res.status(404).json(
                new ApiError(404, "tweet not found")
            )
        }
    
        return res.status(200).json(
            new ApiResponse(200,tweet ,"tweet updated successfully")
        )
    
    
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params;
        
    
        if(!tweetId){
            return res.status(400).json(
                new ApiError(400, "tweetid is required")
            )
        }
    
        const tweet = await Tweet.findByIdAndDelete(
            tweetId
        )
    
        if(!tweet){
            return res.status(404).json(
                new ApiError(404, "tweet not found")
            )
        }
    
        return res.status(200).json(
            new ApiResponse(200,tweet ,"tweet deleted successfully")
        )
    
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}