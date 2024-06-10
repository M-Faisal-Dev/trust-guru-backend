import express from 'express';
import { authMiddleware,isAdmin } from '../middlewares/authMiddleware.js';
const router = express.Router()

import {
    deleteImgs,
    uploadProfile
   

} from '../controller/assetCtrl.js'
import {uploadPhoto, productImgResize, uploadSingleImage, resizeSingleImage } from '../middlewares/uploadImgs.js';






router.post('/upload-profile', uploadSingleImage.single('image'), resizeSingleImage, uploadProfile);
// router.post('/upload-imgs', uploadPhoto.array('images',10),productImgResize, uploadImgs)

router.delete('/delete-imgs/:id', deleteImgs)






export default router