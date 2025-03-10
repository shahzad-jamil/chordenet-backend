
import { Router } from "express";
import  AuthRoutes from "./authRoutes"
import PlanRoutes  from "./plan"
import subscriptionRoutes  from "./subscription"
import authMiddleware from "../middlewares/authMiddleware";
const router=Router()


router.use("/user",AuthRoutes);
router.use("/plan",authMiddleware,PlanRoutes);
router.use("/user-subscription",authMiddleware,subscriptionRoutes)
export default router;