import express from 'express';
import { authMiddleware,isAdmin } from '../middlewares/authMiddleware.js';
const router = express.Router()
import {
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
    getPurchasesTeacher,
    receivedMessages
  
} from '../controller/userCtrl.js';


router.post("/register", createUser)
router.post("/login", loginUser)
router.post("/login-admin", loginAdmin)
router.post('/messages/send/:id', authMiddleware, saveMessage);
router.get("/all-users", getAllUser)
// router.get("/sender-msg/:id", getSanderMessages)
router.get("/sender-msg", authMiddleware, getSanderMessages)
router.get("/receiver-msg", authMiddleware, receivedMessages)

router.get("/refresh", handleRefreshToken)
router.get("/logout", handleLogout)
router.get("/student-purchased-courses", authMiddleware, getStudentPurchasedCourses)
router.get("/teacher-purchased-courses",authMiddleware, getPurchasesTeacher)
router.delete("/:id", deleteUser)
router.post("/forget-password",forgetPasswordToken)
router.put("/reset-password/:token", resetPassword)
router.put("/password",authMiddleware, updatePassword)
router.put("/edit-user",authMiddleware, updateUser)
router.put("/updateProfile",authMiddleware, updateUserProfile)
router.get("/:id", authMiddleware,isAdmin, getSingleUser)
router.put("/block-user/:id",authMiddleware,isAdmin, blockUser)
router.put("/unblock-user/:id",authMiddleware,isAdmin, unblockUser)



export default router
