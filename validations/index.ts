import { Response } from "express";
import { z } from "zod";

type ValidationResult<T> = { success: true; data: T } | never;

const validate = <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  res: Response
): ValidationResult<T> => {
  try {
    const parsedData = schema.parse(data);
    return { success: true, data: parsedData };
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        errors: err.errors,
      });
    }
    throw Error("Validation failed");
  }
};

export default validate;
