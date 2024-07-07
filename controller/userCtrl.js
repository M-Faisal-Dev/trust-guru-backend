import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Course from "../models/courseListing.js";
import Message from '../models/massageModels.js'; 

import generateToken from "../config/jwToken.js";
import validateMongoId from "../ulits/validateMongodbId.js";
import generateRefreshToken from "../config/refreshToken.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../libs/nodeMailer.js";
// import Order from "../models/orderModel.js";
// import uniqid from "uniqid"

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
        // httpOnly: true,
        // sameSite: 'None',
        maxAge: 72 * 60 * 60 * 1000,
      });
      res.json({
        _id: findUser.id,
        firstname: findUser.firstname,
        lastname: findUser.lastname,
        email: findUser.email,
        mobile: findUser.mobile,
        userType: findUser.userType,
        courseOptions: findUser.courseOptions,
        languageOptions: findUser.languageOptions,
        profileImg: findUser.profileImg,
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
        fullName: findAdmin.fullName,
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
console.log(cookie)
console.log("this is is faisflkjs dfkjalsdkf jjk")
  if (!cookie.refreshToken)
    throw new Error("refreshToken is not set in cookie");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      // httpOnly: true,
      // secure: true,
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
    // secure: true,
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

const updateUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.user;
  validateMongoId(id);
  try {
    const upUser = await User.findByIdAndUpdate(
      id,
      {
        courseOptions: req?.body?.courseOptions,
        languageOptions: req?.body?.languageOptions,
        profileImg: req?.body?.profileImgUrl,
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

const findUserbyEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  console.log(req.body)
console.log(email)
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ msg: "User not found with this email address" });
    }

    console.log(user._id);

    // Generate reset URL
    const resetURL = `https://www.trustyourguru.com/reset-password/${user._id}`;

    // Email data
    const data = {
      to: email,
      subject: "Reset Password",
      text: `Your password reset link is: ${resetURL}`,
      html: `<p>Your password reset link is: <a href="${resetURL}">Reset Password</a></p>`,
    };

    // Send email
    await sendEmail(data);

    res.status(200).json({ msg: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to find email. Please try again." });
  }
});


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
  const { id } = req.params;
  
  const user = await User.findById(id);
  
  if (!user) {
    throw new Error("Token Expired, please try again later");
  }
  
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpiresAt = undefined;
  
  await user.save();
  
  res.json(user);
});




const getStudentPurchasedCourses = asyncHandler(async (req, res) => {
  const id = req.user // This should come from req.params or req.body in a real application
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const purchasedCourses = user.purchasedCourses;
    if (!purchasedCourses.length) {
      return res.status(404).json({ message: "No purchased courses found for this user" });
    }

    const courseDetails = await Promise.all(
      purchasedCourses.map(async (purchasedCourse) => {
        const course = await Course.findById(purchasedCourse.courseId);
        if (course) {
          const courseOwner = await User.findById(course.userId).populate("teacherId");
          if (courseOwner) {
            console.log(courseOwner)
            const { fullName, email, profileImg, } = courseOwner;
            return {
              ...purchasedCourse.toObject(),
              courseOwner: {
                fullName,
                email,
                userId: courseOwner._id,
                userType : courseOwner.userType,
                profileImg : courseOwner.teacherId.profileImage,
              },
            };
          }
        }
        return null;
      })
    );

    const validCourseDetails = courseDetails.filter((courseDetail) => courseDetail !== null);

    const { fullName, email, profileImg } = user;

    res.json({
      user: {
        fullName,
        email,
        userId: user._id,
        profileImg,
      },
      purchasedCourses: validCourseDetails,
    });
  } catch (error) {
    console.error("Error fetching purchased courses:", error);
    res.status(500).json({ message: error.message });
  }
});



const getPurchasesTeacher = asyncHandler(async (req, res) => {
  const id = req.user;
  try {
    const user = await User.findById(id);
    const getData = user ? user.purchases : [];
    
    // Get user and course details for each purchase
    const purchasesWithDetails = await Promise.all(
      getData.map(async (purchase) => {
        const student = await User.findById(purchase.studentId, 'fullName email profileImg userType');
        const course = await Course.findById(purchase.courseId);
        console.log(student.userType)
        return {
          ...purchase._doc,
          user: {
            fullName: student?.fullName,
            email: student?.email,
            userId: student?._id,
            profileImg: student?.profileImg,
            userType: student?.userType
          },
          
        };
      })
    );

    res.json(purchasesWithDetails);
  } catch (error) {
    console.error("Error fetching purchases:", error);
    res.status(500).json({ message: "Error fetching purchases", error: error.message });
  }
});




const saveMessage = asyncHandler(async (req, res) => {
  const recipientId = req.params.id;
  const { id: senderId } = req.user;
  const { text, senderName } = req.body;

  try {
    const recipientUser = await User.findById(recipientId);
    if (!recipientUser) {
      return res.status(404).json({ message: 'Recipient user not found' });
    }

    const newMessage = new Message({
      text,
      senderId,
      senderName,
      recipientId,
      recipientName: recipientUser.fullName
    });

    await newMessage.save();

    recipientUser.receivedMessages.push(newMessage._id);
    await recipientUser.save();

    const senderUser = await User.findById(senderId);
    if (!senderUser) {
      return res.status(404).json({ message: 'Sender user not found' });
    }

    senderUser.sentMessages.push(newMessage._id);
    await senderUser.save();

    res.status(201).json({ message: 'Message saved successfully' });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ message: 'Failed to save message', error: error.message });
  }
});

// Get received messages for the logged-in user
const receivedMessages = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  try {
    const user = await User.findById(userId).populate('receivedMessages');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.receivedMessages);
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ message: 'Failed to get messages', error: error.message });
  }
});

// Get sent messages for the logged-in user
const getSanderMessages = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  try {
    const user = await User.findById(userId).populate('sentMessages');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.sentMessages);
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ message: 'Failed to get messages', error: error.message });
  }
});

const getSingleUserWithToken = asyncHandler(async (req, res) => {
  const { id } = req.user;
  validateMongoId(id);
  try {
    const getSingUser = await User.findById(id);
    res.json(getSingUser.bankDetails);
  } catch (error) {
    throw new Error(error);
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
  updateUserProfile,
  getStudentPurchasedCourses,
  saveMessage,
  getSanderMessages,
  receivedMessages,
  getPurchasesTeacher,
  findUserbyEmail,
  getSingleUserWithToken


  
};
