import mongoose from "mongoose";

let couponSchame = new mongoose.Schema({
    name: {
type : String,
required : true,
unique : true,
lowercase : true
    },
    expire: {
type : Date,
required : true
    },
    discount:{
type: Number,
required : true
    }
})


const Coupon = new mongoose.model('Coupon', couponSchame)

export default Coupon;