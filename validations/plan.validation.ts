import { z } from "zod";


export const planSchema=z.object({
        plan_name: z.string().min(1, { message: 'Plan Name is required'}),
        amount: z.number().positive({ message: 'Amount must be a positive number' }),
        currency: z.string().length(3, { message: 'Currency must be a 3-character string' }),
        interval: z.enum(['day', 'week', 'month', 'year'], { message: 'Interval must be one of day, week, month, or year' }),
        status: z.enum(['active', 'inactive'], { message: 'Status must be active or inactive' }),
})