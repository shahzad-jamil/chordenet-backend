import {Router} from 'express';
import subscriptionRoute from "./subscription.route";
const router=Router();

router.use("/subscription", subscriptionRoute);

export default router;