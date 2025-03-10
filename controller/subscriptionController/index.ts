import { Request, Response } from "express";
import asyncHandler from "../../middlewares/trycatch";
import { sendReponse } from "../../utils/helperFunctions/responseHelper";
import db from "../../config/db";
import stripe from "../../utils/services/stripe/stripe";

export const createSubscription=asyncHandler(async(req:any, res:Response)=>{
    try{
      const userId=req.user?.id;
      console.log("userId: ",userId);
      if(!userId)
      {
        return sendReponse(res,401,"UnAuthorized",false);
      }
      const user=await db("users").where("id",userId).first();
      console.log("user: ",user);
      if(!user)
      {
        return sendReponse(res,401,"User not found",false);
      }
      const userEmail=user.email;
  
      const priceId = req.params.id;
     
      console.log("priceId: ",priceId);
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        customer_email: userEmail,
        line_items: [
          {
            price: priceId, 
            quantity: 1,
          },
        ],
        success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`, 
        cancel_url: `${process.env.CLIENT_URL}/cancel`, 
      });
      return sendReponse(res, 200, "Subscription created", true, { checkoutUrl: session.url });
    }
    catch(err)
    {
        return sendReponse(res,500,"Internal Server Error",false,err)
    }
})