import asyncHandler from "express-async-handler";
import validateMongoId from "../ulits/validateMongodbId.js";
import Coupon from "../models/couponModel.js";

const createCoupon = asyncHandler(async(req,res)=>{
try{
const coupon = await Coupon.create(req.body)
res.json(coupon)
}catch(err){
    throw new Error(err)
}

})



const getAllCoupon = asyncHandler(async(req,res)=>{
    try{
    const coupon = await Coupon.find()
    res.json(coupon)
    }catch(err){
        throw new Error(err)
    }
    
    })



    const updateCoupon = asyncHandler(async(req,res)=>{
        const {id} = req.params;
        validateMongoId(id)
        try{
        const coupon = await Coupon.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json(coupon)
         }catch(err){
             throw new Error(err)
         }
     })


     const deleteCoupon = asyncHandler(async(req,res)=>{
        const {id} = req.params;
        validateMongoId(id)
        try{
        const coupon = await Coupon.findByIdAndDelete(id, req.body)
        res.json(coupon)
         }catch(err){
             throw new Error(err)
         }
     })

     const getSingleCoupon = asyncHandler(async(req,res)=>{
        const {id} = req.params;
        validateMongoId(id)
        try{
        const coupon = await Coupon.findById(id)
        res.json(coupon)
         }catch(err){
             throw new Error(err)
         }
     })     




export {
    createCoupon,
    getAllCoupon,
    updateCoupon,
    deleteCoupon,
    getSingleCoupon

}