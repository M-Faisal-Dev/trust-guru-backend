import asyncHandler from "express-async-handler";
import validateMongoId from "../ulits/validateMongodbId.js";
import Category from "../models/productCategoryModel.js";


const createCategory = asyncHandler(async(req,res)=>{
    try{
    const category = await Category.create(req.body)
    res.json(category)
     }catch(err){
         throw new Error(err)
     }
 })


 const updateCategory = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoId(id)
    try{
    const category = await Category.findByIdAndUpdate(id, req.body, {
        new: true
    })
    res.json(category)
     }catch(err){
         throw new Error(err)
     }
 })


 const DeleteCategory = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoId(id)
    try{
    const category = await Category.findByIdAndDelete(id, req.body)
    res.json(category)
     }catch(err){
         throw new Error(err)
     }
 })

 const getSingleCategory = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoId(id)
    try{
    const category = await Category.findById(id)
    res.json(category)
     }catch(err){
         throw new Error(err)
     }
 })
 
 const getAllCategory = asyncHandler(async(req,res)=>{
    try{
    const category = await Category.find()
    res.json(category)
     }catch(err){
         throw new Error(err)
     }
 })
 export {
    createCategory,
    updateCategory,
    DeleteCategory,
    getSingleCategory,
    getAllCategory
    
 }