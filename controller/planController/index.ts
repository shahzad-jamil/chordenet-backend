import { Request, Response } from "express";
import asyncHandler from "../../middlewares/trycatch";
import { sendReponse } from "../../utils/helperFunctions/responseHelper";
import validate from "../../validations";
import { planSchema } from "../../validations/plan.validation";
import stripe from "../../utils/services/stripe/stripe";


export const createPlan=asyncHandler(async(req:Request, res:Response)=>{
    try{
        //@ts-ignore
        const userId=req.user?.id;
        if(!userId)
        {
            return sendReponse(res,401,"Unauthorized",false)
        }
        const data=validate(planSchema,req.body,res)
        if(!data.success){
           return sendReponse(res,401,"Validation failed",false)
        }
        const planDetails=req.body
  
        try {

            const product = await stripe.products.create({
                name: planDetails.name,
            });
            const price = await stripe.prices.create({
                unit_amount: planDetails.amount * 100, 
                currency: planDetails.currency,
                recurring: { interval: planDetails.interval }, 
                product: product.id,
            });
            return sendReponse(res, 201, "Plan created successfully", true, { product, price });
        } catch (error) {
            console.error("Error creating Stripe plan:", error);
            return sendReponse(res, 500, "Error creating Stripe plan", false, error);
        }
      
    }
    catch(error){
        return sendReponse(res,500,"Internal Server Error",false,error)
    }
})