import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Cart from "../models/cartModel.js";
import Coupon from "../models/couponModel.js";

import generateToken from "../config/jwToken.js";
import validateMongoId from "../ulits/validateMongodbId.js";
import generateRefreshToken from "../config/refreshToken.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "./emailCtrl.js";
import Order from "../models/orderModel.js";
import uniqid from "uniqid"

const createUser = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      const createdUser = await User.create(req.body);
      res.json(createdUser);
    } else {
      throw new Error("user already exists");
    }
  } catch (err) {
    throw new Error(err);
  }
});

// login user

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const findUser = await User.findOne({ email });
    if (findUser && (await findUser.isPasswordMatch(password))) {
      const refreshToken = generateRefreshToken(findUser?.id);
      const updatedUser = await User.findByIdAndUpdate(
        findUser.id,
        {
          refreshToken: refreshToken,
        },
        { new: true }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });
      res.json({
        _id: findUser.id,
        firstname: findUser.firstname,
        lastname: findUser.lastname,
        email: findUser.email,
        mobile: findUser.mobile,
        token: generateToken(findUser?._id),
      });
    } else {
      throw new Error("invalid username or password");
    }
  } catch (error) {
    throw new Error(error);
  }
});

// login in Admin 

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const findAdmin = await User.findOne({ email });

    if (!findAdmin || findAdmin.role !== "Admin") {
      throw new Error("Not authorized");
    }

    if (await findAdmin.isPasswordMatch(password)) {
      const refreshToken = generateRefreshToken(findAdmin.id);
      const updatedUser = await User.findByIdAndUpdate(
        findAdmin.id,
        {
          refreshToken: refreshToken,
        },
        { new: true }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });
      res.json({
        _id: findAdmin.id,
        firstname: findAdmin.firstname,
        lastname: findAdmin.lastname,
        email: findAdmin.email,
        mobile: findAdmin.mobile,
        token: generateToken(findAdmin._id),
      });
    } else {
      throw new Error("Invalid username or password");
    }
  } catch (error) {
   throw new Error(error);
  }
});



// handle refeshToken

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken)
    throw new Error("refreshToken is not set in cookie");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("not refresh token available");
  jwt.verify(refreshToken, process.env.SECRET_KEY, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("there is something wrong with the refresh token");
    }
    const accessToken = generateToken(user?._id);
    res.json({accessToken});
  });
});

// user logout functionality

const handleLogout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken)
    throw new Error("refreshToken is not set in cookie");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204);
  }
  const clearCookies = await User.findOneAndUpdate(
    { refreshToken },
    {
      refreshToken: "",
    },
    { new: true }
  );
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204)
});

// get all user

const getAllUser = asyncHandler(async (req, res) => {
  try {
    const getUser = await User.find();
    res.json(getUser);
  } catch (error) {
    throw new Error(error);
  }
});

// get single user

const getSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const getSingUser = await User.findById(id);
    res.json(getSingUser);
  } catch (error) {
    throw new Error(error);
  }
});

// delete user

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const delUser = await User.findByIdAndDelete(id);
    res.json(delUser);
  } catch (error) {
    throw new Error(error);
  }
});

// update user
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.user;
  validateMongoId(id);
  try {
    const upUser = await User.findByIdAndUpdate(
      id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      { new: true }
    );

    res.json(upUser);
  } catch (error) {
    throw new Error(error);
  }
});

// block user

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const block = await User.findByIdAndUpdate(
      id,
      { isBlocked: true },
      { new: true }
    );
    res.json({
      message: "User Blocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});

// unblockUser

const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const unBlock = await User.findByIdAndUpdate(
      id,
      { isBlocked: false },
      { new: true }
    );
    res.json({
      message: "Unblock User",
    });
  } catch (error) {
    throw new Error(error);
  }
});

// update password 

const updatePassword = asyncHandler(async (req,res)=>{
const { id } = req.user
const { password } = req.body;
validateMongoId(id);
try{
const user = await User.findById(id);
if(password){
  user.password = password;
  const updatePassword = await user.save()
  res.json(updatePassword)
}else{
  res.json(user)
}
}catch(error){
throw new Error(error);
}
})

// forget password token 


const forgetPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  
  if (!user) {
    throw new Error("User not found with this email address");
  }
  
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    let resetUrl = `http://localhost:5000/api/user/reset-password/${token}`;
    const data = {
      to: email,
      text: "Hello, please follow the link to reset your password: " + resetUrl,
      subject: "Reset your password",
      html: `<a href="${resetUrl}">Click Here</a>`,
    };
    
    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});


// reset password

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpiresAt: { $gt: Date.now() },
  });
  
  if (!user) {
    throw new Error("Token Expired, please try again later");
  }
  
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpiresAt = undefined;
  
  await user.save();
  
  res.json(user);
});



const getWishList = asyncHandler(async(req, res)=>{
  const {id} = req.user;
  try{
const findUser = await User.findById(id).populate("wishlist")
res.json(findUser)
  }catch(error){
throw new Error(error)
  }
})

// save your Address 

const saveAddress = asyncHandler(async (req, res) =>{
  const {id} = req.user;
  validateMongoId(id);
  try {
    const address = await User.findByIdAndUpdate(
      id,
      {
        address: req?.body?.address,
      },
      { new: true }
    );

    res.json(address);
  } catch (error) {
    throw new Error(error);
  }

}
)


const userCart = asyncHandler(async (req, res) => {
  const { cart } = req.body;
  const { id } = req.user;
  validateMongoId(id);
  try {
    const products = [];
    const user = await User.findById(id);

    // User ke liye mojood cart ko hata diya jaaye
    await Cart.deleteMany({ orderBy: user.id });

    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i].id;
      object.count = cart[i].count;
      let getPrice = await Product.findById(cart[i].id).select("price").exec();
      object.price = getPrice.price;
      products.push(object);
    }

    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal += products[i].price * products[i].count;
    }


    let newCart = await new Cart({
      products,
      cartTotal,
      orderBy: user.id,
    }).save();

    res.json(newCart);
  } catch (error) {
    throw new Error(error);
  }
});


const getCart = asyncHandler(async (req, res) => {
  const {_id} = req.user;
  validateMongoId(_id);
  try{
    const cart = await Cart.findOne({orderBy: _id}).populate("products.product")
res.json(cart);

  }catch(error){
    throw new Error(error);
  }

})


const emptyCart = asyncHandler(async (req, res) => {
  const {_id} = req.user;
  validateMongoId(_id);
  try{
    const user = await User.findOne({_id})
    const cart = await Cart.findOneAndRemove({orderBy : user?._id})
res.json(cart);

  }catch(error){
    throw new Error(error);
  }

})



const applyCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { _id } = req.user;
  validateMongoId(_id);
  try {
    const validCoupon = await Coupon.findOne({ name: coupon });
    if (!validCoupon) {
      throw new Error("Invalid Coupon");
    }
    const user = await User.findOne({ _id });
    const cart = await Cart.findOne({
      orderBy: user?._id
    }).populate("products.product");

    const { products, cartTotal } = cart;
    const totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount) / 100).toFixed(2);

    await Cart.findOneAndUpdate(
      { orderBy: user?._id },
      { totalAfterDiscount },
      { new: true }
    );

    res.json(totalAfterDiscount);
  } catch (error) {
  throw new Error(error);
  }
});


const createOrder = asyncHandler(async (req, res) => {
  const { COD, couponApplied } = req.body;
  const { _id } = req.user;
  // validateMongoId(_id); // Assuming this function is defined correctly

  try {
    if (!COD) throw new Error("Create cash order failed");

    const user = await User.findById(_id);
    let userCart = await Cart.findOne({ orderBy: user._id });
    let finalAmount = 0;

    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmount = userCart.totalAfterDiscount;
    } else {
      finalAmount = userCart.cartTotal;
    }

    let newOrder = await new Order({
      products: userCart.products,
      paymentIntent: {
        id: uniqid(),
        method: "COD",
        amount: finalAmount,
        status: "Cash on Delivery",
        created: Date.now(),
        currency: "usd",
      },
      orderBy: user._id,
      orderStatus: "Cash on Delivery",
    }).save();

    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: item.count, sold: +item.count } },
        },
      };
    });

    const updated = await Product.bulkWrite(update, {});

    res.json({ message: "Order successfully updated" });
  } catch (error) {
   throw new Error(error)
  }
});


const getOrder = asyncHandler(async(req, res) => {
  const {_id} = req.user;
  validateMongoId(_id);
  try{
const userOrder = await Order.findOne({orderBy : _id}).populate("products.product").exec()
res.json(userOrder)
  }catch(error){
    throw new Error(error);
  }
})


const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  validateMongoId(id);

  try {
    const updateOrder = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentIntent: {
          status: status
        }
      },
      { new: true }
    );

    res.json(updateOrder);
  } catch (error) {
   throw  new Error(error)
  }
});


export {
  createUser,
  loginUser,
  getAllUser,
  getSingleUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  handleLogout,
  updatePassword,
  forgetPasswordToken,
  resetPassword,
  loginAdmin,
  getWishList,
  saveAddress,
  userCart,
  getCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrder,
  updateOrderStatus
  
};
