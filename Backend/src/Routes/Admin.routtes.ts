import express from "express";
import { Request, Response } from "express";
import { User, userBan } from "../Models/schema.user.ts";
import { protect } from "../Middleware/auth.middlewares.ts";
import { requireAdmin } from "../Middleware/admin.middleware.ts";
import { notifyUser } from "../utils/Notification/notify.ts";
import { NotificationPurpose } from "../Models/schema.notification.ts";
import { Product } from "../Models/schema.products.ts";
import { Order } from "../Models/schema.order.ts";
import { Review } from "../Models/schema.reviews.ts";
import { Notification } from "../Models/schema.notification.ts";

const router = express.Router();


router.get("/stats", protect, requireAdmin, async (req: Request, res: Response) => {
  try {
    const [userCount, productCount, orderCount, reviewCount] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Review.countDocuments(),
    ]);
    res.json({ userCount, productCount, orderCount, reviewCount });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

router.get("/users", protect, requireAdmin, async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("name email role accountStatus");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

router.patch("/users/:id/ban", protect, requireAdmin, async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { accountStatus: userBan.BAN },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    await notifyUser(
      user._id,
      NotificationPurpose.BAN,
      "Account Suspended",
      "Your account has been banned. Contact support if you believe this is a mistake."
    );

    res.json({ message: "User banned" });
  } catch (err) {
    res.status(400).json({ message: "Failed to ban user" });
  }
});

router.post("/notifications", protect, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { userId, title, message } = req.body as {
      userId: string;
      title: string;
      message: string;
    };

    const notification = await notifyUser(userId, NotificationPurpose.ADMIN, title, message);
    res.status(201).json(notification);
  } catch (err) {
    res.status(400).json({ message: "Failed to send notification" });
  }
});

export default router;