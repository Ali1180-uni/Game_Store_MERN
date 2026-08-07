import { Request, Response, NextFunction } from "express";
import { userRole } from "../Models/schema.user.ts";

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== userRole.ADMIN) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};