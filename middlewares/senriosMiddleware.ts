import { NextFunction, Request, Response } from "express"; 
import db from "../config/db"; 
import { TABLE } from "../utils/Database/table";
 

export const checkActiveScenarioLimit = async(useid:any , res:any) => {
  
    try {
      const userId = useid;  

      if (!userId) {
        return   res.status(401).json({ status: 401, success: false, message: "Unauthorized" });
       
      }
      const checkUserFreeTrial = await db.query(
        `SELECT free_scenario FROM "${TABLE.USER}" WHERE id = $1`,
        [userId]
      );
      
      if (checkUserFreeTrial.rows.length > 0 && checkUserFreeTrial.rows[0].free_scenario > 0) {
         
      } else {
        const subData = await db.query(
          `SELECT scenarios_used, scenarios FROM "${TABLE.SUBSCRIPTION}" WHERE user_id = $1 AND status = 'active'`,
          [userId]
        );
  
        if (subData.rowCount === 0) {
          return  res.status(403).json({ status: 403, success: false, message: "You don't have an active subscription" });
           
        }
  
        const { scenarios_used, scenarios } = subData.rows[0];
   
        if (Number(scenarios_used) >= Number(scenarios)) {
          return  res.status(403).json({ status: 403, success: false, message: "Your scenario limit has been completed" });
           
        }
      }
       
     
    } catch (error) {
      console.error("Error in checkActiveScenarioLimit middleware:", error);
      res.status(500).json({ status: 500, success: false, message: "Internal server error" });
    }
  };
 
