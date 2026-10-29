import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const subscribedBy = req.user._id
    // TODO: toggle subscription
    if(!channelId){
        return res.status(400).json(
            new ApiResponse(400, null, "channel id missing")
        )
    }
    const channel = await User.findById(channelId);
    if(!channel){
        return res.status(404).json(
            new ApiError(404, null, "channel not found...")
        )
    }
    const isSubscribed = await Subscription.findOne({
        subscriber:subscribedBy,
           channel:channelId,
    })

    if(isSubscribed){
        await Subscription.findByIdAndDelete(isSubscribed._id)
        return res.status(200).json(
            new ApiResponse(200,null,"channel unsubscribed successfully")
        )
    }

    if(channelId === subscribedBy.toString()){
        return res.status(400).json(
            new ApiError(400, null, "you cant subscribe your channel")
        )
    }
    const subscription = await Subscription.create(
        {
           subscriber:subscribedBy,
           channel:channelId, 
        }
    )
    if(!subscription){
        return res.status(500).json(
            new ApiError(500,null, "error while creating subscriptions..")
        )
    }
    return res.status(201).json(
        new ApiResponse(201,subscription,"channel subscribed successfully")
    )
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params;
    if(!channelId){
        return res.status(400).json(
            new ApiResponse(400, null, "channel id missing")
        )
    }
    const subscribers = await Subscription.find({
        channel:channelId,
    })

    if(!subscribers || subscribers.length===0){
        return res.status(404).
           json(new ApiError(404,null, "subscribers not found"))
    }

    return res.status(200).json(
        new ApiResponse(200, subscribers, "subscribers found successfully")
    )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const  {channelId}  = req.params
    if(!channelId){
        return res.status(400).json(
            new ApiResponse(400, null, "subscriber id missing")
        )
    }
    const channelsSubscribed = await Subscription.find({
        subscriber:channelId,
    })

    if(!channelsSubscribed || channelsSubscribed.length===0){
        return res.status(404).
           json(new ApiError(404,null, "subscribed channel not found"))
    }

    return res.status(200).json(
        new ApiResponse(200, channelsSubscribed, "subscribed channel found successfully")
    )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}