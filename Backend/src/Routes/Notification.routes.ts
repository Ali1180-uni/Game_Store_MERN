import express from "express";
import { Request, Response } from "express";
import { User } from "../Models/schema.user.ts";
import { Notification } from "../Models/schema.notification.ts";
import { protect } from "../Middleware/auth.middlewares.ts";

const router = express.Router();

// Get my notifications, newest first
router.get("/", protect, async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Not authorized" });
  try {
    const user = await User.findById(req.user._id).populate({
      path: "notifications",
      options: { sort: { createdAt: -1 } },
    });
    res.json(user?.notifications ?? []);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

// Mark one as read
router.patch("/:id/read", protect, async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Not authorized" });
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: "Notification not found" });
    res.json(notification);
  } catch (err) {
    res.status(400).json({ message: "Failed to update notification" });
  }
});

export default router;