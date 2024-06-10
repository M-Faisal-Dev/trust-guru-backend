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
} from '../controller/dealHunterCtrl.js'



router.post('/', createUser)
router.get('/:id', getSingleUser)
router.get('/', getAllUser)
router.put('/update-user/:id', updateUser)
router.put('/block-user/:id', blockUser)
router.put('/unblock-user/:id', unblockUser)
router.delete('/delete-user/:id', deleteUser)







export default router