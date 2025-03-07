import StripeRoute from "./plan.Route"
import { Router } from "express"
const router=Router();
router.use("/admin-plan", StripeRoute);
export default router