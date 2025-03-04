
import { Router } from "express";
import  AuthRoutes from "./authRoutes"
const router=Router()


router.use("/auth",AuthRoutes)
// router.use("/user",AuthRoutes)

export default router