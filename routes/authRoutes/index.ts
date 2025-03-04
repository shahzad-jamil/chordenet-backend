import AuthRoutes from "./auth.Routes";
import {Router} from "express";
const router=Router()
router.use("/auth",AuthRoutes);
// router.use("/user",AuthRoutes)


export default router