import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "../Models/schema.user.ts"; // adjust path/name to match your actual User model file

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    req.user =
      (await User.findById(decoded.id).select("-password")) ?? undefined;

    if (!req.user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};
