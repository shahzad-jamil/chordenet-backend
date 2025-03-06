import authMiddleware from "../../middlewares/authMiddleware";
import ROLES from "../../utils/enums/roles.enum";
import AuthRoutes from "./auth.Route";
import userProfile from "./userProfile.Route"
import {Router} from "express";
const router=Router()
router.use("/auth",AuthRoutes);
router.use('/user-profile',authMiddleware,userProfile)



export default router