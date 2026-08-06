import express from "express";
import { Request, Response } from "express";
import { Address } from "../Models/schema.address.ts";
import { User } from "../Models/schema.user.ts";
import { protect } from "../Middleware/auth.middlewares.ts";

const router = express.Router();

router.get("/", protect, async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Not authorized" });
  try {
    const user = await User.findById(req.user._id).populate("addresses");
    res.json(user?.addresses ?? []);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch addresses" });
  }
});

router.post("/", protect, async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Not authorized" });
  try {
    const { fullname, phone, province, city, street } = req.body;
    const address = await Address.create({ fullname, phone, province, city, street });
    await User.findByIdAndUpdate(req.user._id, { $push: { addresses: address._id } });
    res.status(201).json(address);
  } catch (err) {
    res.status(400).json({ message: "Failed to add address" });
  }
});

export default router;