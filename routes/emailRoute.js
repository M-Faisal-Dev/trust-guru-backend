import express from 'express';
const router = express.Router()

import {
    sendMail,
} from '../controller/emailCtrl.js'




router.post('/', sendMail)

export default router