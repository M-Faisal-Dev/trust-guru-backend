import express from 'express';
import { authMiddleware,isAdmin } from '../middlewares/authMiddleware.js';
const router = express.Router()

import {
    createUser,
    getSingleUser,
    getAllUser,
    updateUser,
    deleteUser,
    blockUser,
    unblockUser,
} from '../controller/assetHolderCtrl.js'
// import { uploadPhoto, productImgResize } from '../middlewares/uploadImgs.js';



router.post('/', createUser)
router.get('/:id', getSingleUser)
router.get('/', getAllUser)
router.put('/update-user/:id', updateUser)
router.put('/block-user/:id', blockUser)
router.put('/unblock-user/:id', unblockUser)
router.delete('/delete-user', deleteUser)







export default router