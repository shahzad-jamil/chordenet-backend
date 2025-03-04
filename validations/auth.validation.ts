import { z } from "zod";

export const authSchema=z.object({
    email:z.string().email({message:"Invalid email"}),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
})

export const changePasswordSchema=z.object({
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters long" }),
})
