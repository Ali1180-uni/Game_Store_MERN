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

router.get(
  "/stats",
  protect,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const [userCount, productCount, orderCount, reviewCount] =
        await Promise.all([
          User.countDocuments(),
          Product.countDocuments(),
          Order.countDocuments(),
          Review.countDocuments(),
        ]);
      res.json({ userCount, productCount, orderCount, reviewCount });
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  }
);

router.get(
  "/users",
  protect,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const users = await User.find().select("name email role accountStatus");
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  }
);

router.patch(
  "/users/:id/ban",
  protect,
  requireAdmin,
  async (req: Request, res: Response) => {
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
  }
);

router.patch(
  "/users/:id/role",
  protect,
  requireAdmin,
  async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    const { role } = req.body as { role: string };
    const validRoles = ["Admin", "Employee", "Customer"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (String(req.params.id) === String(req.user._id) && role !== "Admin") {
      return res
        .status(400)
        .json({ message: "You can't remove your own admin access" });
    }

    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true }
      ).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (err) {
      res.status(400).json({ message: "Failed to update role" });
    }
  }
);

router.put(
  "/users/:id",
  protect,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const { name, email } = req.body as { name: string; email: string };
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { name, email },
        { new: true, runValidators: true }
      ).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (err: any) {
      if (err.code === 11000) {
        return res.status(409).json({ message: "Email is already in use" });
      }
      res.status(400).json({ message: "Failed to update user" });
    }
  }
);

router.delete(
  "/users/:id",
  protect,
  requireAdmin,
  async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    if (String(req.params.id) === String(req.user._id)) {
      return res
        .status(400)
        .json({ message: "You can't delete your own account" });
    }

    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json({ message: "User deleted" });
    } catch (err) {
      res.status(400).json({ message: "Failed to delete user" });
    }
  }
);

router.get(
  "/users/:id/reviews",
  protect,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const reviews = await Review.find({ user: req.params.id })
        .populate("product", "title image")
        .sort({ createdAt: -1 });
      res.json(reviews);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch user's reviews" });
    }
  }
);

router.patch(
  "/users/:id/status",
  protect,
  requireAdmin,
  async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    const { accountStatus } = req.body as { accountStatus: "Ban" | "No Ban" };
    if (!["Ban", "No Ban"].includes(accountStatus)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    if (String(req.params.id) === String(req.user._id)) {
      return res
        .status(400)
        .json({ message: "You can't ban your own account" });
    }

    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { accountStatus },
        { new: true }
      ).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });

      await notifyUser(
        user._id,
        NotificationPurpose.BAN,
        accountStatus === "Ban" ? "Account Suspended" : "Account Reinstated",
        accountStatus === "Ban"
          ? "Your account has been suspended. Contact support if you believe this is a mistake."
          : "Your account access has been restored. Welcome back!"
      );

      res.json(user);
    } catch (err) {
      res.status(400).json({ message: "Failed to update account status" });
    }
  }
);

router.post(
  "/notifications",
  protect,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const { userId, title, message } = req.body as {
        userId: string;
        title: string;
        message: string;
      };

      const notification = await notifyUser(
        userId,
        NotificationPurpose.ADMIN,
        title,
        message
      );
      res.status(201).json(notification);
    } catch (err) {
      res.status(400).json({ message: "Failed to send notification" });
    }
  }
);

export default router;
