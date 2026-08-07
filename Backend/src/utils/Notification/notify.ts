import { Notification, NotificationPurpose } from "../../Models/schema.notification.ts";
import { User } from "../../Models/schema.user.ts";
import mongoose from "mongoose";

export const notifyUser = async (
  userId: mongoose.Types.ObjectId | string,
  purpose: NotificationPurpose,
  title: string,
  message: string
) => {
  const notification = await Notification.create({ title, purpose, message });
  await User.findByIdAndUpdate(userId, { $push: { notifications: notification._id } });
  return notification;
};