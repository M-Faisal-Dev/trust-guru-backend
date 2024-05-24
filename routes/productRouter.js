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
    uploadImgs,
    deleteImgs
} from '../controller/productCtrl.js'
import { uploadPhoto, productImgResize } from '../middlewares/uploadImgs.js';



router.post('/',authMiddleware,isAdmin, createProduct)
router.get('/', getAllProduct)
router.get('/:id', getSingleProduct)
router.put('/wishlist',authMiddleware,isAdmin, addToWishList)
router.put('/rating',authMiddleware, addRating)
router.put('/upload-imgs',authMiddleware,isAdmin, uploadPhoto.array('images',10),productImgResize, uploadImgs)
router.put('/:id',authMiddleware,isAdmin, updateProduct)
router.delete('/:id',authMiddleware,isAdmin, deleteProduct)
router.delete('/delete-imgs/:id',authMiddleware,isAdmin, deleteImgs)






export default router