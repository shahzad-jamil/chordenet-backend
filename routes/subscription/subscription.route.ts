import {Router} from "express";
import { SUBSCRIPTION } from "../../utils/enums/subscription.enum";
import * as SubscriptionController from "../../controller/subscriptionController"
const router = Router();

router.post(SUBSCRIPTION.BUYSUSCRIPTION,SubscriptionController.createSubscription);

export default router;