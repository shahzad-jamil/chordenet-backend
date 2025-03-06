import { Router } from "express"
import { AUTH } from "../../utils/enums/auth.enum";
import * as AuthController from "../../controller/authController";
const router=Router();
router.post(AUTH.UPDATE_PROFILE,AuthController.updateProfile);

export default router