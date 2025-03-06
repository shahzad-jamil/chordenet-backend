import {Router} from "express";
import { AUTH } from "../../utils/enums/auth.enum";
import * as AuthController from "../../controller/authController";
import authMiddleware from "../../middlewares/authMiddleware";
const router=Router()

router.post(AUTH.CREATE_USER,AuthController.createUser);
router.post(AUTH.LOGIN_USER,AuthController.loginUser);
router.post(AUTH.CHANGE_PASSWORD,authMiddleware,AuthController.changePassword);
router.post(AUTH.UPDATE_PASSWORD,authMiddleware,AuthController.updatePassword);
router.post(AUTH.FORGOT_PASSWORD,AuthController.forgetPassword);
router.post(AUTH.VERIFY_EMAIL,AuthController.verifyEmail)


export default router