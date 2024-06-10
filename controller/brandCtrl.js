import asyncHandler from "express-async-handler";
import validateMongoId from "../ulits/validateMongodbId.js";
import Brand from "../models/brandModel.js";


const createBrand = asyncHandler(async(req,res)=>{
    try{
    const brand = await Brand.create(req.body)
    res.json(brand)
     }catch(err){
         throw new Error(err)
     }
 })


 const updateBrand = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoId(id)
    try{
    const brand = await Brand.findByIdAndUpdate(id, req.body, {
        new: true
    })
    res.json(brand)
     }catch(err){
         throw new Error(err)
     }
 })


 const DeleteBrand = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoId(id)
    try{
    const brand = await Brand.findByIdAndDelete(id, req.body)
    res.json(brand)
     }catch(err){
         throw new Error(err)
     }
 })

 const getSingleBrand = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoId(id)
    try{
    const brand = await Brand.findById(id)
    res.json(brand)
     }catch(err){
         throw new Error(err)
     }
 })
 
 const getAllBrand = asyncHandler(async(req,res)=>{
    try{
    const brand = await Brand.find()
    res.json(brand)
     }catch(err){
         throw new Error(err)
     }
 })
 export {
    createBrand,
    updateBrand,
    DeleteBrand,
    getSingleBrand,
    getAllBrand
    
 }