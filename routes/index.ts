
import { Router } from "express";
import  AuthRoutes from "./authRoutes"
const router=Router()


router.use("/user",AuthRoutes)

export default router