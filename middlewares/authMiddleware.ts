import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { verifyToken } from "../utils/services/jwt"; 
import db from "../config/db"; 

export interface AuthRequest extends Request {
  user?: { id: string }; 
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
      return 
    }
    const decoded = verifyToken(token) as jwt.JwtPayload;
    const userId = decoded.id;
    const verifyUser = await db("users").where("id", userId).first();
    if (!verifyUser) {
        res.status(404).json({ success: false, message: "User not found" });
      return 
    }
    if (verifyUser.isVerified===false) {
        res.status(403).json({ success: false, message: "User is not verified" });
      return 
    }
    
    req.user = { id: userId };
    next();
  } catch (error) {
    console.error("Error in authMiddleware:", error); 
    res.status(401).json({ success: false, message: "Invalid token or authentication error" });
    return 
  }
};

export default authMiddleware;
