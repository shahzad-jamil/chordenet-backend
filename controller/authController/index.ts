import { Request, Response } from "express";
import asyncHandler from "../../middlewares/trycatch";
import db from "../../config/db";
import validate from "../../validations";
import { authSchema, loginSchema } from "../../validations/auth.validation";
import { sendReponse } from "../../utils/helperFunctions/responseHelper";
import { changePasswordSchema } from "../../validations/auth.validation";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../../types";
import { createResetToken, getSignedJwt, verifyToken } from "../../utils/services/jwt";
import { responseData } from "../../utils/response";
import { sendRegistrationEmail } from "../../utils/services/nodemailer/register";
import { sendPasswordResetEmail } from "../../utils/services/nodemailer/forgetPassword";

export const createUser = asyncHandler(async (req: Request, res: Response) => {
    const { first_name, last_name, email, password, confirmPassword, provider, provider_id, profile_image } = req.body;
    try {

        let existingUser = await db("users").where({ email }).first();
        if (existingUser) {
            if (existingUser.isVerified === false) {
                const token = createResetToken({ email }, "10m");
                const dbtoken = await db("tokens").insert({user_id:existingUser.id,token:token,token_type:"verify_user"});
                if(!dbtoken)
                {
                    return sendReponse(res, 500, "Error in generating token", false);
                }
                await sendRegistrationEmail(existingUser.email,token);
                return sendReponse(res, 200, "Verification email resent. Please verify your account.", true);
            }
            if (provider && provider_id && existingUser.provider === "email") {
                await db("users")
                    .where({ email })
                    .update({
                        provider, provider_id,
                        isVerified: true,
                        first_name: existingUser.first_name || first_name,
                        last_name: existingUser.last_name || last_name,
                        profile_image: existingUser.profile_image || profile_image,
                    });
                const updatedUser = await db("users").where({ email }).first();
                const token = getSignedJwt(updatedUser.id);
                return sendReponse(res, 200, "User upgraded to social login", true, { user: updatedUser, token });
            }
            if (provider && existingUser.provider === provider) {
                const token = getSignedJwt(existingUser.id);
                return sendReponse(res, 200, "Login successful", true, { user: existingUser, token });
            }
            return sendReponse(res, 400, "Email already exists", false);
        }
        if (!provider || provider === "email") {
            if (!password || !confirmPassword) {
                return sendReponse(res, 400, "Password is required for email signup", false);
            }
            if (password !== confirmPassword) {
                return sendReponse(res, 400, "Password and Confirm Password do not match", false);
            }
        }
        const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
        const newUser = await db("users")
            .insert({
                first_name,
                last_name,
                email,
                password: hashedPassword,
                profile_image,
                provider: provider || "email",
                provider_id: provider_id || null,
                role: "user",
                isActive: true,
                isVerified: provider ? true : false,
            })
            .returning(["id", "first_name", "last_name", "email", "profile_image", "provider", "role", "isVerified"]);
        const userData = newUser[0];
        if (!provider || provider === "email") {
            const token = createResetToken({ email }, "10m");
            const dbtoken = await db("tokens").insert({user_id:userData.id,token:token,token_type:"verify_user"});
            if(!dbtoken)
            {
                return sendReponse(res, 500, "Error in generating token", false);
            }
            await sendRegistrationEmail(userData.email,token);
        }
        const token = getSignedJwt(userData.id);
        return sendReponse(res, 201, "User registered successfully", true, userData);
    } catch (err) {
        console.error(err);
        return sendReponse(res, 500, "Internal server error", false);
    }
});
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
    try {
        const data = validate(loginSchema, req.body, res);
        if (!data.success) {
            return sendReponse(res, 400, "Validation error", false);
        }
        const { email, password } = req.body;
        const user = await db("users").whereRaw("LOWER(email) = LOWER(?)", [email]).first();

        if (!user) {
            return sendReponse(res, 400, "User does not Exist", false);
        }

        if (user.isVerified === false) {
            return sendReponse(res, 400, "User is not verified", false);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return sendReponse(res, 400, "Invalid email or password", false);
        }

        const token = getSignedJwt(user.id);
        return sendReponse(res, 200, "Login successful", true, { user, token });

    }
    catch (err) {
        return sendReponse(res, 500, "Internal Server Error", false, err);
    }
});
export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        const data = validate(changePasswordSchema, req.body, res);
        if (!data.success) {
            return sendReponse(res, 400, "Validation error", false);
        }
        const userId = req.user?.id;
        console.log(userId);
        const { password, newPassword, confirmPassword } = req.body;
        if (newPassword !== confirmPassword) {
            return sendReponse(res, 400, "New Password and Confirm Password do not match", false);
        }
        const user = await db("users").where({ id: userId }).first();
        if (!user) {
            return sendReponse(res, 400, "User not found", false);
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return sendReponse(res, 400, "Old password is incorrect", false);
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db("users").where({ id: userId }).update({ password: hashedPassword });
        return sendReponse(res, 200, "Password changed successfully", true);
    }
    catch (err) {
        console.error(err);
        return sendReponse(res, 500, "Internal server error", false, err);
    }
});
export const forgetPassword = asyncHandler(async (req: Request, res: Response) => {

    try {
        const { email } = req.body;
        if (!email) {
            return sendReponse(res, 401, "Please provide a valid email", false);
        }
        const existUser = await db('users').where({ email }).first();
        if (!existUser) {
            return sendReponse(res, 404, "User not found with this email", false);
        }
        const id = existUser.id;
        const token=getSignedJwt(id);
        const dbtoken = await db("tokens").insert({user_id:id, token:token,token_type:"forget_password"});

        if(!dbtoken)
        {
            return sendReponse(res, 500, "Error in generating token", false);
        }
        await sendPasswordResetEmail(email, id, res,token);
        return sendReponse(res, 200, "Reset password link has been sent to your email", true);
    }
    catch (err) {
        console.error(err);
        return sendReponse(res, 500, "Internal server error", false, err);
    }
});
export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        console.log(userId);
        const { name, email } = req.body;
        if (!name || !email) {
            return sendReponse(res, 400, "Please provide valid name and email", false);
        }
        if (email !== req.user?.email) {
            const existUser = await db('users').where({ email }).first();
            if (existUser) {
                return sendReponse(res, 400, "Email already exists", false);
            }
        }
        await db('users').where({ id: userId }).update({ name, email });
        return sendReponse(res, 200, "Profile updated successfully", true);
    }
    catch (err) {
        console.error(err);
        return sendReponse(res, 500, "Internal server error", false);
    }
});
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { token } = req.body;
        if (!token) {
            return sendReponse(res, 401, "Token is missing", false);
        }
        const decodedToken = verifyToken(token);
        if (!decodedToken || typeof decodedToken === "string" || !decodedToken.email) {
            return sendReponse(res, 401, "Invalid token", false);
        }
        const userEmail = decodedToken.email;
        await db("users").where({ email: userEmail }).update({ isVerified: true });
        return sendReponse(res, 200, "User verified successfully", true);
    } catch (err) {
        console.error(err);
        return sendReponse(res, 500, "Internal server error", false);
    }
});
export const updatePassword = asyncHandler(async (req: Request, res: Response) => {
    try {
        //@ts-ignore
        const userId = req.user?.id;
        const existingUser = await db("users").where("id", userId).first();
        if (!existingUser) {
            return sendReponse(res, 404, "User not found", false);
        }
        const { newPassword, confirmPassword } = req.body;
        if (!newPassword || !confirmPassword) {
            return sendReponse(res, 400, "Please provide valid new password and confirm password", false);
        }
        if (newPassword !== confirmPassword) {
            return sendReponse(res, 400, "New password and confirm password do not match", false);
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db("users")
            .where("id", userId)
            .update({ password: hashedPassword });
        return sendReponse(res, 200, "Password updated successfully", true);
    }
    catch (err) {
        console.error(err);
        return sendReponse(res, 500, "Internal server error", false);
    }
})
export const checkToken= asyncHandler(async(req:any,res:Response)=>{
    try{
        const {token,token_type}=req.body;
        if(token)
        {
            const tokenRecord = await db("tokens")
            .where({ token, token_type })
            .orderBy("created_at", "desc") 
            .first();
            if (!tokenRecord) {
                return sendReponse(res, 401, "Invalid or expired token", false);
            }
            if (tokenRecord.is_used===true) {
                return sendReponse(res, 401, "Token has already been used", false);
            }
            const tokenCreatedAt = new Date(tokenRecord.created_at);
            const now = new Date();
            const timeDiff = (now.getTime() - tokenCreatedAt.getTime()) / 60000;
            if (timeDiff > 10) {
                return sendReponse(res, 401, "Token has expired", false);
            }

        }
        return sendReponse(res, 200, "Token not found", false);
    }
    catch(err)
    {
        return sendReponse(res,500,"Internal Server Error",false,err)
    }
})

