import express from "express";
const router = express.Router();

import userRoute from "./authRouter.js"
import assetRoute from "./assetroute.js"
import productRouter from "./productRouter.js"
import teacherRouter from "./teacherRoute.js"


 

router.use("/teacher-profile", teacherRouter);
router.use("/course", productRouter);
router.use("/", userRoute);
router.use("/", assetRoute);


export default router;
 