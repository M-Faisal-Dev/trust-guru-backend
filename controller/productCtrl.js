import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import validateMongoId from "../ulits/validateMongodbId.js";
import Product from "../models/courseListing.js";
import slugify from "slugify";




// create product 
const createProduct = asyncHandler(async(req,res)=>{
  const {id} = req.user;
  validateMongoId(id);
   try{
    
    const productData = {
      ...req.body,
      userId: id
    };

    // Create slug if title is present
    if (req.body.title) {
      productData.slug = slugify(req.body.title);
    }

    // Create the product
    const createPdt = await Product.create(productData);

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


  

// getCourseByToken 
const getCourseByToken = asyncHandler(async (req, res) => {
  const {id} = req.params;// Assuming this is the teacher's ID
  validateMongoId(id); // Validate the provided ID

  try {
    // Find users by teacherId
    const getUserCourses = await User.find({ teacherId: id });

    if (!getUserCourses || getUserCourses.length === 0) {
      return res.status(404).json({ error: "Users not found" });
    }

    // Array to store all courses
    let allCourses = [];

    // Iterate through each user to find their courses
    for (let user of getUserCourses) {
      // Find courses based on userId (assuming it's stored in Product as userId)
      const courses = await Product.find({ userId: user._id });
      allCourses.push(...courses); // Push courses into the allCourses array
    }

    res.json(allCourses); // Return all courses found
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
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








const addPurchasedCourse = asyncHandler(async (req, res) => {
  const { id } = req.user; // Assumes user ID is in req.user
  const { courseId, plan, price } = req.body;
  console.log(courseId, plan, price )
  validateMongoId(id);
  validateMongoId(courseId);

  try {
    let user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let course = await Product.findById(courseId).populate('userId');
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }


    const purchasedCourse = {
      courseId,
      courseTitle: course.courseTitle,
      plan,
      price
    };

    user.purchasedCourses.push(purchasedCourse);
  const SaveUser = await user.save();

  console.log(SaveUser, "this is save user" )

   
      const teacher = await User.findById(course.userId[0]._id); // Correctly access the userId field
      console.log(teacher, "this is teacher")
     
      if (!teacher) {
        return res.status(404).json({ error: 'Teacher not found' });
      }

console.log(SaveUser._id, "this is student ")
      const studentPurchase = {
        studentId: SaveUser._id,
        studentName: "Muhammad Faisal",
        courseId,
        courseTitle: "this is title",
        plan,
        price
      };

      teacher.purchases.push(studentPurchase);
     const TeacherSave =  await teacher.save();
    console.log(TeacherSave, "this is teacher save")





    res.status(201).json({
      message: 'Course purchased successfully',
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});




export {
    createProduct,
    getSingleProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
    addToWishList,
    addRating,
    addPurchasedCourse,
    getCourseByToken
}