import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import validateMongoId from "../ulits/validateMongodbId.js";
import Product from "../models/productModel.js";
import slugify from "slugify";
import {uploadFileToCloudinary,deleteFileFromCloudinary} from "../ulits/cloudinary.js";
import fs from "fs";



// create product 
const createProduct = asyncHandler(async(req,res)=>{
   try{
    
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
        }
   const createPdt = await Product.create(req.body)
   res.json(createPdt)
    }catch(err){
        throw new Error(err)
    }
})

// get single product 
const getSingleProduct = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoId(id)
    try{
const singleProduct = await Product.findById(id)
res.json(singleProduct)
    }catch(err){
throw new Error(err)
    }
})


// get all product 
const getAllProduct = asyncHandler(async (req, res) => {
    const queryObj = { ...req.query };
    const excludeField = ["page", "sort", "limit", "fields"];
    excludeField.forEach((element) => delete queryObj[element]);
  
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  
    let query = Product.find(JSON.parse(queryStr));
  
    // sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }
  
    // limiting the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }
  
    // pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    const productCount = await Product.countDocuments();
    if (skip >= productCount) throw new Error("This page does not exist");
  
    try {
      const allProduct = await query;
      res.json(allProduct);
    } catch (err) {
      throw new Error(err);
    }
  });
  
  

// get update product 
const updateProduct = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoId(id)
    try{
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
        }
    const upProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    res.json(upProduct)
    }catch(err){
        throw new Error(err)
    }
})

// delete product 
const deleteProduct = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoId(id)
    try{
    const dltProduct = await Product.findByIdAndDelete(id);
    res.json(dltProduct)
    }catch(err){
        throw new Error(err)
    }
})


const addToWishList = asyncHandler(async(req,res)=>{
const {id} = req.user;
const {prodId} = req.body;
try{
const user = await User.findById(id)
const allreadyAdd = user.wishlist.find(id => id.toString() === prodId)
if(allreadyAdd){
  const user = await User.findByIdAndUpdate(id, {$pull:{wishlist:prodId}},
    {new: true})
    res.json(user)
}else{
  const user = await User.findByIdAndUpdate(id, {$push:{wishlist:prodId}},
    {new: true})
    res.json(user)

}

}catch(err){
  throw new Error(err)
}
 
})


const addRating = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const { star, prodId , comment} = req.body;
  try {
    const product = await Product.findById(prodId);
let allreadyRated = product.ratings.find(rating => rating.postedBy.toString() === id.toString());
    if (allreadyRated) {
    const updateRating = await Product.updateOne(
      {
        ratings : {$elemMatch: allreadyRated}
      },
      {
        $set: {"ratings.$.star": star,"ratings.$.comment": comment},
      },
      {
        new: true,
      }
    );
    }else{
      const rateProduct = await Product.findByIdAndUpdate(
        prodId, {$push:{ ratings: {
          star: star,
          comment: comment,
          postedBy: id,
        }}},{
          new: true
        }
      )
    }
const getallrating = await Product.findById(prodId);
let totalRating = getallrating.ratings.length;
let ratingSum = getallrating.ratings.map((item)=> item.star).reduce((prev, current)=> prev + current, 0);
let actualRating = Math.round(ratingSum / totalRating);
const finalProduct = await Product.findByIdAndUpdate(prodId,{
  totalrating: actualRating,
},{
  new: true
})
res.json(finalProduct)
  } catch (err) {
    throw new Error(err)
  }
});

const uploadImgs = asyncHandler(async(req, res) => {
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

    const images = urls.map((item) => {
      return item
    })
    res.json(images)

  }catch(err){
    throw new Error(err)
  }
})


const deleteImgs = asyncHandler(async(req, res) => {
  const {id} = req.params;
  try{
    const Deleted = deleteFileFromCloudinary(id, "images");
    res.json({message: "Image deleted successfully"})
  
 
  }catch(err){
    throw new Error(err)
  }
})


export {
    createProduct,
    getSingleProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
    addToWishList,
    addRating,
    uploadImgs,
    deleteImgs
}