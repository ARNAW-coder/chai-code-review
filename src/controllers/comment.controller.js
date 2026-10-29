import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const page = Math.max(Number(req.query.page) || 1,1);
    const limit = Math.max(Number(req.query.limit) || 10,1);

    if(!videoId){
        return res.status(400).json(
            new ApiError(400, "video id is required")
        );
    }

    const comments = await Comment.find(
        {video: videoId}
    ).sort({createdAt:-1})
    .skip((page-1)*limit)
    .limit(limit);
    
    return res.status(200).json(
        new ApiResponse(200, comments, "comments fetched successfully")
    )
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
     const {videoId} = req.params;
     const {content} = req.body || {};
      
     if(!content || !videoId){    
        return res.status(400).json(new ApiError(400, "comment content is required"))}
     
     const comment = await Comment.create({
          content,
          video : videoId,
          owner: req.user._id,
     }
     )

     if(!comment){
        return res.status(500).json(new ApiResponse(500, "error while creating comment"))
     }

     return res.status(201).json(
        new ApiResponse(201, comment , "comment created successfully...")
     )
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params;
    const {content} = req.body;

    if(!commentId || !content){
        return res.status(400).json(
            new ApiError(400, "commentid or content is required")
        )
    }

    const comment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set:{content}            
        },
        {new:true}
    )

    if(!comment){
        return res.status(404).json(
            new ApiError(404, "comment not found")
        )
    }

    return res.status(200).json(
        new ApiResponse(200,comment ,"comment updated successfully")
    )

    
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params;
    

    if(!commentId){
        return res.status(400).json(
            new ApiError(400, "commentid is required")
        )
    }

    const comment = await Comment.findByIdAndDelete(
        commentId
    )

    if(!comment){
        return res.status(404).json(
            new ApiError(404, "comment not found")
        )
    }

    return res.status(200).json(
        new ApiResponse(200,comment ,"comment deleted successfully")
    )

})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }