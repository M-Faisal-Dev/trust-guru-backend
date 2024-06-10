import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  console.log(req?.headers)
  if (req?.headers?.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];

    try {
      if (token) {
        const decodedToken = jwt.verify(token, "secret_key");
    const user = await User.findById(decodedToken?.id)
    req.user = user;
    next()
      }
    } catch (err) {
      throw new Error("Not authorized token. Please login again.");
    }
  } else {
    throw new Error("No token attached.");
  }
 
});


const isAdmin = asyncHandler(async(req, res, next)=>{
    const {email} = req.user;
    try{
const adminUser = await User.findOne({email})
if(adminUser.role !== "Admin"){
throw new Error("you are not an administrator")
}else{
    next()
}
    }catch(err){
throw new Error(err)
    }
})

export { authMiddleware,isAdmin };
