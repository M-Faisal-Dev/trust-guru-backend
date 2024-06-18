import express from 'express';
import { authMiddleware,isAdmin } from '../middlewares/authMiddleware.js';
const router = express.Router()

import {
    deleteImgs,
    uploadProfile
   

} from '../controller/assetCtrl.js'
import {uploadPhoto, productImgResize, uploadSingleImage, resizeSingleImage, resizeCoverImage, resizeProductImage } from '../middlewares/uploadImgs.js';






router.post('/upload-profile', uploadSingleImage.single('image'), resizeSingleImage, uploadProfile);
router.post('/upload-cover', uploadSingleImage.single('image'), resizeCoverImage, uploadProfile);
router.post('/upload-product-img', uploadSingleImage.single('image'), resizeProductImage, uploadProfile);

// router.post('/upload-imgs', uploadPhoto.array('images',10),productImgResize, uploadImgs)

router.delete('/delete-imgs/:id', deleteImgs)






export default router