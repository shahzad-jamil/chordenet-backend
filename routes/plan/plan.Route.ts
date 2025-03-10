import { Router } from "express";
import { STRIPE } from "../../utils/enums/stripe.enum";
import * as PlanController from "../../controller/planController"
const router=Router();

router.post(STRIPE.CREATEPLAN,PlanController.createPlan);
router.patch(STRIPE.UPDATEPLAN,PlanController.updatePlan);
router.post(STRIPE.DELETEPLAN,PlanController.deletePlan);




export default router