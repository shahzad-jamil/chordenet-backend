// import { NextFunction, Request, Response } from "express";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import { response } from "../utils/response";
// import db from "../config/db";
// import type { User } from "../utils/types/auth";
// import { AUTH } from "../utils/Database/queries/auth";
// import { verifyToken } from "../utils/services/jwt";
// import { USERS } from "../utils/Database/queries/users";
// import ROLES from "../utils/enums/role.enum";

// declare global {
//   namespace Express {
//     interface Request {
//       user?: User;
//     } 
//   }
// }

// export const authMiddleware =
//   (roles: string[]) =>
//     async (req: Request, res: Response, next: NextFunction) => {
//       try {
//         const token = req.header("Authorization")?.replace("Bearer ", "");

//         if (!token) {
//           response(res, 401, "Unauthorized");
//           return;
//         }

//         // Verify token
//         const decoded = verifyToken(token) as { id: string };
//         const userId = decoded.id;

//         const result = await db.query(USERS.USER_DETAIL_BY_ID, [userId]);
//         const user = result.rows[0] as User;

//         if (!user) {
//           response(res, 404, "User not found");
//           return;
//         }

//         // Check if the user is verified
//         if (!user.isVerified) {
//           response(res, 403, "User is not verified");
//           return;
//         }

//         if (!user.isActive) {
//           response(res, 403, "User account has been disabled by administrator");
//           return;
//         }

//         // if (!user.hasSubscription) {
//         //   response(res, 403, "User does not have an active subscription");
//         //   return;
//         // }
//         if (!roles.includes(user.role)) {
//           response(res, 403, "Unauthorized");
//           return;
//         }

//         req.user = user;
//         next();
//       } catch (error) {
//         response(res, 401, "Unauthorized");
//         return;
//       }
//     };

// export const isGuest =
//   (roles: string[]) =>
//     async (req: Request, res: Response, next: NextFunction) => {
//       try {
//         const token = req.header("Authorization")?.replace("Bearer ", "");

//         if (!token) {
//           response(res, 401, "Unauthorized");
//           return;
//         }
//         console.log("secret key", process.env.JWT_SECRET);
//         const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload & { id: string };
//         const userId = decoded.id;

//         const result = await db.query(USERS.USER_DETAIL_BY_ID, [userId]);
//         const user = result.rows[0] as User;

//         if (!user) {
//           response(res, 404, "User not found");
//           return;
//         }
//         if (!user.isVerified) {
//           response(res, 403, "User is not verified");
//           return;
//         } 
//         if (!user.isActive) {
//           response(res, 403, "User account has been disabled by administrator");
//           return;
//         }

//         if (!roles.includes(user.role)) {
//           response(res, 403, "Unauthorized");
//           return;
//         }

//         req.user = user;
//         next();
//       } catch (error) {

//         response(res, 401, "Unauthorized");
//         return;
//       }
//     };
//     export const checkScenarioLimit = (roles: string[]) => {
//       return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//         try {
//           const token = req.header("Authorization")?.replace("Bearer ", "");
    
//           if (!token) {
//             response(res, 401, "Unauthorized");
//             return;
//           }
//           const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload & { id: string };
//           const userId = decoded.id;
    
    
//           const userResult = await db.query(USERS.USER_SCENARIO_COUNT, [userId]);
//           const user = userResult.rows[0];
    
//           if (!roles.includes(user.role)) {
//             response(res, 403, "Unauthorized");
//             return;
//           }
    
//           if (!user) {
//             response(res, 404, "User not found");
//             return;
//           }
//           if (user.free_scenario == 0 && user.hasSubscription==false) {
//             response(res, 403, "You must purchase a subscription to create more scenarios.");
//             return;
//           }
    
//           next(); 
//         } catch (error) {
//           console.error("Error checking scenario limit:", error);
//           response(res, 500, " Server Error");
//           return;
//         }
//       };
//     };



import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: any;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return; 
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload & { userID: number };
        req.user = { id: decoded.userID };
        

        next(); 
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid token" });
        return;
    }
};

export default authMiddleware;