import { Request, Response } from "express";
import asyncHandler from "../../middlewares/trycatch";
import { sendReponse } from "../../utils/helperFunctions/responseHelper";
import validate from "../../validations";
import { planSchema } from "../../validations/plan.validation";
import stripe from "../../utils/services/stripe/stripe";
import db from "../../config/db";


export const createPlan = asyncHandler(async (req: Request, res: Response) => {
    try {
        //@ts-ignore
        const userId = req.user?.id;
        if (!userId) {
            return sendReponse(res, 401, "Unauthorized", false)
        }
        const data = validate(planSchema, req.body, res)
        if (!data.success) {
            return sendReponse(res, 401, "Validation failed", false)
        }
        const planDetails = req.body

        try {

            const product = await stripe.products.create({
                name: planDetails.plan_name,
            });
            const price = await stripe.prices.create({
                unit_amount: planDetails.amount * 100,
                currency: planDetails.currency,
                recurring: { interval: planDetails.interval },
                product: product.id,
            });
            if (!product.id || !price.id) {
                return sendReponse(res, 500, "Stripe plan not created Successfully", false)
            }
            const data = await db("plans").insert({
                plan_name: planDetails.plan_name,
                plan_price: planDetails.amount,
                time_interval: planDetails.interval,
                stripe_price_id: price.id,
                plan_type: planDetails.plan_type,
                stripe_product_id: product.id,
                status: planDetails.status,
                currency: planDetails.currency,
                plan_title: planDetails.title,
                features: JSON.stringify(planDetails.features),
                is_popular: planDetails.is_popular,
            }).returning("*");

            return sendReponse(res, 201, "Plan created successfully", true, data);
        } catch (error) {
            console.error("Error creating Stripe plan:", error);
            return sendReponse(res, 500, "Error creating Stripe plan", false, error);
        }

    }
    catch (error) {
        return sendReponse(res, 500, "Internal Server Error", false, error)
    }
});
export const updatePlan = asyncHandler(async (req: Request, res: Response) => {
    try {
        //@ts-ignore
        const userId = req.user?.id;
        if (!userId) {
            return sendReponse(res, 401, "Unauthorized", false)
        }
        const data = validate(planSchema, req.body, res);
        if (!data.success) {
            return sendReponse(res, 401, "Validation failed", false)
        }
        const planDetails = data.data;
        if (!userId) {
            return sendReponse(res, 401, "Unauthorized", false)
        }
        const PlanId = req.params
        const getPlanData = await db("plans").where('id', PlanId.id).first();
        console.log(",.,,.,.,.,.,", getPlanData)
        if (!getPlanData) {
            return sendReponse(res, 404, "Plan not found", false)
        }
        console.log(getPlanData.plan_price, planDetails.amount);
        if (Number(planDetails.amount) !== Number(getPlanData.plan_price) || planDetails.currency !== getPlanData.currency) {
            try {
                await stripe.products.update(getPlanData.stripe_product_id, { active: false });
                const newProduct = await stripe.products.create({
                    name: planDetails.plan_name,
                });
                const newPrice = await stripe.prices.create({
                    unit_amount: planDetails.amount * 100,
                    currency: planDetails.currency,
                    recurring: { interval: planDetails.interval },
                    product: newProduct.id,
                });
                const newProductId = newProduct.id;
                const newPriceId = newPrice.id;
            }
            catch (err) {
                return sendReponse(res, 500, "New PLan is not created", false, err);
            }
        }
        await stripe.products.update(getPlanData.stripe_product_id, { name: planDetails.plan_name, });
        const updatedPlan = await db("plans")
            .where({ id: PlanId.id })
            .update({
                plan_name: planDetails.plan_name,
                plan_price: planDetails.amount,
                time_interval: planDetails.interval,
                stripe_price_id: getPlanData.stripe_price_id,
                stripe_product_id: getPlanData.stripe_product_id,
                plan_type: planDetails.plan_type,
                status: planDetails.status,
                plan_title: planDetails.title,
                currency: planDetails.currency,
                updated_at: new Date(),
            }).returning("*");
        return sendReponse(res, 200, "Plan Updated Successfully", true, updatedPlan);
    }
    catch (err) {
        console.log(err);
        return sendReponse(res, 500, "Internal Server Error", false, err)
    }
});
export const deletePlan = asyncHandler(async (req: any, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return sendReponse(res, 401, "Unauthorized", false)
        }
        const planId = req.params
        const getPlanData = await db("plans").where('id', planId.id).first();
        if (!getPlanData) {
            return sendReponse(res, 404, "Plan not found", false)
        }
        await stripe.products.update(getPlanData.stripe_product_id, { active: false });
        await db("plans").where('id', planId.id).delete();
        return sendReponse(res, 200, "Plan deleted Successfully", true)
    }
    catch (err) {
        console.log(err);
        return sendReponse(res, 500, "Internal Server Error", false, err)
    }
});
export const deActivatePlan = asyncHandler(async (req: any, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return sendReponse(res, 401, "Unauthorized", false)
        }
        const productId = req.params
        if(!productId) {
            return sendReponse(res, 404, "ProductID not found", false)
        }
        const product=await db("plans").where("stripe_product_id", productId).first();
        if(!product) {
            return sendReponse(res, 404, "Plan not found", false)
        }
        const archivedProduct =await stripe.products.update(product.stripe_product_id, { active: false });
        if(archivedProduct){
           const archivedProductDB= await db("plans").where("stripe_product_id", productId).update({status: "inactive"});
           return sendReponse(res, 200,"Plan DeActivated Successfully",true,archivedProductDB);
        }
        return sendReponse(res, 401,"Failed to deactivate plan",false);

    }
    catch (err) {
        console.log(err);
        return sendReponse(res, 500, "Internal Server Error", false, err);
    }
})
export const reActivatePlan=asyncHandler(async(req:any, res:Response)=>{
    try {
        const userId = req.user?.id;
        if (!userId) {
            return sendReponse(res, 401, "Unauthorized", false)
        }
        const productId = req.params
        if(!productId) {
            return sendReponse(res, 404, "ProductID not found", false)
        }
        const reactivatedProduct = await stripe.products.update(productId, {
          active: true,
        });
        if(!reactivatedProduct)
        {
            return sendReponse(res, 401,"Failed to reactivate plan",false)
        }
        if(reactivatedProduct)
        {
            const reactivatedProductDB= await db("plans").where("stripe_product_id", productId).update({status: "active"});
            return sendReponse(res, 200,"Plan Reactivated Successfully",true,reactivatedProductDB);
        }
      } catch (error) {
        console.error("Error reactivating plan:", error);
        throw new Error("Failed to reactivate plan.");
      }
})