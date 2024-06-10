import express from 'express';
import { authMiddleware,isAdmin } from '../middlewares/authMiddleware.js';
const router = express.Router()

import {
    createProduct,
    getSingleProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
    // addToWishList,
    addRating,
    getRelatedProduct
} from '../controller/propertyCtrl.js'
// import { uploadPhoto, productImgResize } from '../middlewares/uploadImgs.js';



router.post('/', createProduct)
router.get('/', getAllProduct)
router.get('/related-property', getRelatedProduct)
router.get('/:id', getSingleProduct)
// router.put('/wishlist',authMiddleware,isAdmin, addToWishList)
// router.put('/rating',authMiddleware, addRating)
router.put('/rating', addRating)
// router.put('/upload-imgs',authMiddleware,isAdmin, uploadPhoto.array('images',10),productImgResize, uploadImgs)
// router.put('/:id',authMiddleware,isAdmin, updateProduct)
router.put('/:id', updateProduct)
// router.delete('/:id',authMiddleware,isAdmin, deleteProduct)
router.delete('/:id', deleteProduct)
// router.delete('/delete-imgs/:id',authMiddleware,isAdmin, deleteImgs)






export default router