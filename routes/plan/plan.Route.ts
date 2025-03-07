import { Router } from "express";
import { STRIPE } from "../../utils/enums/stripe.enum";
import * as PlanController from "../../controller/planController"
const router=Router();

router.post(STRIPE.CREATEPLAN,PlanController.createPlan);




export default router