import User from "../models/userModel.js";
import Blog from "../models/blogModel.js";
import asyncHandler from "express-async-handler";
import validateMongoId from "../ulits/validateMongodbId.js";
import {uploadFileToCloudinary} from "../ulits/cloudinary.js";
import fs from "fs";



const createBlog = asyncHandler(async(req,res)=>{
    try{
 const blog = await Blog.create(req.body)
 res.json(blog);
    }catch(err){
throw new Error(err)
    }
    
})


const getSingleBlog = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoId(id)
try{
  const getBlog = await Blog.findById(id).populate("likes").populate("disLikes")
const blog = await Blog.findByIdAndUpdate(id,
    {$inc : {numViews : 1}},
    {new: true})
res.json(getBlog);

}catch(err){
throw new Error(err);
}

})


const getAllBlog = asyncHandler(async(req,res)=>{
try{
const blog = await Blog.find()
res.json(blog);

}catch(err){
throw new Error(err);
}

})



const updateBlog = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoId(id)
    try{
    const blog = await Blog.findByIdAndUpdate(id, req.body, {new: true})
    res.json(blog);
    
    }catch(err){
    throw new Error(err);
    }
    
    })


    const deleteBlog = asyncHandler(async(req,res)=>{
        const {id} = req.params;
        validateMongoId(id)
    try{
    const blog = await Blog.findByIdAndDelete(id)
    res.json(blog);
    
    }catch(err){
    throw new Error(err);
    }
    
    })


    const likeBlog = asyncHandler(async (req, res) => {
        const { blogId } = req.body;
        validateMongoId(blogId);
      
        try {
          // Find the blog which you want to like
          const blog = await Blog.findById(blogId);

          const isLiked = blog?.isLiked;
      
          // Find the logged-in user
          const loginUserId = req?.user?.id;
      
          // Find if the user has already disliked this blog
          const alreadyDisliked = blog.disLikes.find(
            (userId) => userId.toString() === loginUserId?.toString()
          );
      
      
          if (alreadyDisliked) {
            // Remove the user from the disLikes array and set isDisLiked to false
            const updatedBlog = await Blog.findByIdAndUpdate(
              blogId,
              {
                $pull: { disLikes: loginUserId },
                isDisliked: false
              },
              { new: true }
            );
      
            res.json(updatedBlog);
          } else {
      
            if (isLiked) {
              // Remove the user from the likes array and set isLiked to false
              const updatedBlog = await Blog.findByIdAndUpdate(
                blogId,
                {
                  $pull: { likes: loginUserId },
                  isLiked: false
                },
                { new: true }
              );
      
              res.json(updatedBlog);
            } else {
              // Add the user to the likes array and set isLiked to true
              const updatedBlog = await Blog.findByIdAndUpdate(
                blogId,
                {
                  $push: { likes: loginUserId },
                  isLiked: true
                },
                { new: true }
              );
      
              res.json(updatedBlog);
            }
          }
        } catch (err) {
          throw new Error(err);
        }
      });
      

      const dislikeBlog = asyncHandler(async (req, res) => {
        const { blogId } = req.body;
        validateMongoId(blogId);
      
        try {
          // Find the blog which you want to dislike
          const blog = await Blog.findById(blogId);
      
          const isDisliked = blog?.isDisliked;
      
          // Find the logged-in user
          const loginUserId = req?.user?.id;
      
          // Find if the user has already liked this blog
          const alreadyLiked = blog.likes.find(
            (userId) => userId.toString() === loginUserId?.toString()
          );
      
      
          if (alreadyLiked) {
            // Remove the user from the likes array and set isLiked to false
            const updatedBlog = await Blog.findByIdAndUpdate(
              blogId,
              {
                $pull: { likes: loginUserId },
                isLiked: false
              },
              { new: true }
            );
      
            res.json(updatedBlog);
          } else {
            if (isDisliked) {
              // Remove the user from the disLikes array and set isDisliked to false
              const updatedBlog = await Blog.findByIdAndUpdate(
                blogId,
                {
                  $pull: { disLikes: loginUserId },
                  isDisliked: false
                },
                { new: true }
              );
      
              res.json(updatedBlog);
            } else {
              // Add the user to the disLikes array and set isDisliked to true
              const updatedBlog = await Blog.findByIdAndUpdate(
                blogId,
                {
                  $push: { disLikes: loginUserId },
                  isDisliked: true
                },
                { new: true }
              );
      
              res.json(updatedBlog);
            }
          }
        } catch (err) {
          throw new Error(err);
        }
      });
      
      const uploadImgs = asyncHandler(async(req, res) => {
        const {id} = req.params;
        validateMongoId(id)
        try{
          const uploader = (path) => uploadFileToCloudinary(path, "images");
          const urls = [];
          const files = req.files;
          for(const file of files){
            const {path} = file;
            const newPath = await uploader(path);
            urls.push(newPath);
          fs.unlinkSync(path);
      
          }
      
          const findProduct = await Blog.findByIdAndUpdate(id,{images: urls.map((file) => {
            return file
          })},
          {new: true}
          );
          res.json(findProduct)
        }catch(err){
          throw new Error(err)
        }
      })


export 
{
    createBlog,
    getSingleBlog,
    getAllBlog,
    updateBlog,
    deleteBlog,
    likeBlog,
    dislikeBlog,
    uploadImgs,
}