import { Request, Response } from "express";
import asyncHandler from "../../middlewares/trycatch";
import db from "../../config/db"; 
import validate from "../../validations";
import { authSchema } from "../../validations/auth.validation";
import { sendReponse } from "../../utils/helperFunctions/responseHelper";
import { changePasswordSchema } from "../../validations/auth.validation";


import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../../types";

export const createUser = asyncHandler(async (req: Request, res: Response) => {
    const data = validate(authSchema, req.body, res);
    if (!data.success) {
        return sendReponse(res, 400, "Validation error", false);
    }

    const { email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return sendReponse(res, 400, "Password and Confirm Password do not match", false);
    }

    try {
        const existingUser = await db("users").where({ email }).first();
        if (existingUser) {
            return sendReponse(res, 400, "Email already exists", false);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [newUser] = await db("users")
            .insert({
                email,
                password: hashedPassword,
            })
            .returning(["id", "email"]); 

        const token = jwt.sign(
            { userID: newUser.id },
            process.env.JWT_SECRET as string,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        return sendReponse(res, 201, "User registered successfully", true, { user: newUser, token });

    } catch (err) {
        console.error(err);
        return sendReponse(res, 500, "Internal server error", false, err);
    }


});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const data = validate(authSchema, req.body, res);
    if (!data.success) {
        return sendReponse(res, 400, "Validation error", false);
    }
    const { email, password } = req.body;

    const user = await db("users").where({ email }).first();
    if (!user) {
        return sendReponse(res, 400, "Invalid email or password", false);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return sendReponse(res, 400, "Invalid email or password", false);
    }

    const token = jwt.sign(
        { userID: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: process.env.JWT_EXPIRE || "5d" }
    );

    return sendReponse(res, 200, "Login successful", true, {   user: { email: user.email }, token });
});


export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
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
});
