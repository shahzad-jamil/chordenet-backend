import { z } from "zod";

export const planSchema = z.object({
        plan_name: z.string()
                .min(1, { message: "Plan Name is required" })
                .max(255, { message: "Plan Name cannot exceed 255 characters" }),

        amount: z.number()
                .positive({ message: "Amount must be a positive number" })
                .max(100000, { message: "Amount cannot exceed 100,000" }),

        currency: z.string()
                .length(3, { message: "Currency must be a 3-character string (e.g., USD, EUR, INR)" })
                .regex(/^[A-Z]{3}$/, { message: "Currency must be in uppercase letters" }),

        interval: z.enum(["day", "week", "month", "year"], {
                message: "Interval must be one of: day, week, month, or year"
        }),

        status: z.enum(["active", "inactive"], {
                message: "Status must be either 'active' or 'inactive'"
        }),

        plan_type: z.string()
                .optional()
                .nullable()
                .or(z.literal("")),
                title: z.string()
                .optional()
                .nullable()
                .or(z.literal("")),

        is_popular: z.optional(z.boolean()),

        features: z.optional(z.array(z.string()).max(10, {
                message: "You can include up to 10 features only"
        })),
});
