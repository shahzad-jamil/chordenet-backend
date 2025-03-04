import {Router} from "express";
import { AUTH } from "../../utils/enums/auth.enum";
import * as AuthController from "../../controller/authController";
import authMiddleware from "../../middlewares/authMiddleware";
const router=Router()

router.post(AUTH.CREATE_USER,AuthController.createUser);
router.post(AUTH.LOGIN_USER,AuthController.loginUser);
router.post(AUTH.CHANGE_PASSWORD,authMiddleware,AuthController.changePassword);

export default router