import express from 'express';
import { authMiddleware,isAdmin } from '../middlewares/authMiddleware.js';
const router = express.Router()

import {
    createProduct,
    getSingleProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
    addToWishList,
    addRating,
    addPurchasedCourse
} from '../controller/productCtrl.js'
import { uploadPhoto, productImgResize } from '../middlewares/uploadImgs.js';



router.post('/create',authMiddleware, createProduct)
router.get('/', getAllProduct)
router.get('/:id', getSingleProduct)
// router.put('/wishlist',authMiddleware,isAdmin, addToWishList)

router.post('/add-purchased-course',authMiddleware, addPurchasedCourse)

router.put('/rating',authMiddleware, addRating)
router.put('/:id',authMiddleware,isAdmin, updateProduct)
router.delete('/:id',authMiddleware,isAdmin, deleteProduct)







export default router