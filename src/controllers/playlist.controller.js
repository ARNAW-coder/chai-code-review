import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body || {};

    if([name, description].some((field)=>{field.trim()===""})){
        return new ApiError(400, "playlist name and description are required")
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner:req.user._id,
    })

    if(!playlist){
        throw new ApiError(400, "playlist is not created")

    }

    return res.status(200).json(
        new ApiResponse(200, playlist, "playlist created successfully")
    )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists   ids are stored in datbase as an object , and the ids we get through params is string
    
    if(!userId){
        return new ApiError(404, "userId not found")
    }

    // const user = new mongoose.Types.ObjectId(userId);

    const playlist = await Playlist.find({owner: userId})         //playlist.find returns an array of playlists as there can be multiple playlists for a user

    
    
    if(!playlist || playlist.length === 0){
        return new ApiError(404, "playlist not found for this user")}

    return res.status(200).json(
        new ApiResponse(200, playlist, "playlists fetched successfully")
    )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id

    if(!playlistId){
        return new ApiError(404, "playlistId not found")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        return new ApiError(404, "playlist not found for this id")}
    
    return res.status(200).json(
            new ApiResponse(200, playlist, "playlist fetched successfully"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

        if(!playlistId || !videoId){
            return new ApiError(404, "playlistId or videoId not found")
        }
        
        const playlist = await Playlist.findByIdAndUpdate(
            playlistId,
        {
            $addToSet:{videos: videoId}   // $addToSet operator adds a value to an array only if it doesn't already exist in the array, preventing duplicates.
        },
    {new:true})  // ye option isliye dena padta hai taki updated playlist mile na ki purana playlist....

    if(!playlist){
        return new ApiError(400, "error while uploading video to playlist")
    }

    return res.status(200).json(
        new ApiResponse(200, playlist, "video added to playlist successfully")
    )
})  

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    
    if(!playlistId || !videoId){
            return new ApiError(404, "playlistId or videoId not found")
        }
    
    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull:{
                videos: videoId,  // $pull operator removes all instances of a value from an existing array that match a specified condition.
            }
        },
        {new:true}
    )

    if(!playlist){
        return new ApiError(400, "error while removing video from playlist")
    }       

    return res.status(200).json(
        new ApiResponse(200, playlist, "video removed from playlist successfully")
    )
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    
    if(!playlistId){
        return new ApiError(400, "playlistId is not found")
    }
    
    const playlist = await Playlist.findByIdAndDelete(playlistId)

    if(!playlist){
        return new ApiError(400, "error while deleting playlist")}
    
    return res.status(200).json(
        new ApiResponse(200, "playlist deleted successfully")
    )    


})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    if(!playlistId){
        return new ApiError(400, "playlistId is not found")
    }
    else if(!name || !description){
        return new ApiError(400, "playlist name and description are required")
    }
    
    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set:{name, description}
        },
        {new:true}
    )

    if(!playlist){
        return new ApiError(400, "error while updating playlist")
    }

    return res.status(200).json(
        new ApiResponse(200, playlist, "playlist updated successfully")
    )
}) 

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}