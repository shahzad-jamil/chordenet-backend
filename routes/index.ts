
import { Router } from "express";
import  AuthRoutes from "./authRoutes"
import PlanRoutes  from "./plan"
import authMiddleware from "../middlewares/authMiddleware";
const router=Router()


router.use("/user",AuthRoutes)
router.use("/plan",authMiddleware,PlanRoutes)

export default router