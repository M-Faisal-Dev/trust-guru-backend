import express from "express";
const router = express.Router();

import userRoute from "./authRouter.js"
import assetRoute from "./assetroute.js"


 

router.use("/", userRoute);
router.use("/", assetRoute);


export default router;
 