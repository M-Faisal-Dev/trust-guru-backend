import express from 'express';
import { authMiddleware,isAdmin } from '../middlewares/authMiddleware.js';
const router = express.Router()

import {
    createBlog,
    getSingleBlog,
    getAllBlog,
    updateBlog,
    deleteBlog,
    likeBlog,
    dislikeBlog,
    uploadImgs,

} from '../controller/blogCtrl.js'
import { uploadPhoto, blogImgResize } from '../middlewares/uploadImgs.js';





router.get('/',getAllBlog)
router.get('/:id',getSingleBlog)

router.put('/likes',authMiddleware,likeBlog)
router.put('/dislikes',authMiddleware,dislikeBlog)
router.post('/',authMiddleware,isAdmin,createBlog)
router.put('/:id',authMiddleware,isAdmin,updateBlog)
router.put('/upload-imgs/:id',
authMiddleware,
isAdmin, 
uploadPhoto.array('images',10),
blogImgResize,
uploadImgs)
router.delete('/:id',authMiddleware,isAdmin,deleteBlog)






export default router