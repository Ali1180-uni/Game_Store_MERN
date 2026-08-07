import mongoose, { Schema, Model } from "mongoose";

export enum NotificationPurpose {
  ORDER = "Order",
  PAYMENT = "Payment",
  BAN = "Ban",
  ACCOUNT = "Account",
  ADMIN = "Admin",
}

export interface INotification {
  title: string;
  purpose: NotificationPurpose;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    title: { type: String, required: true },
    purpose: {
      type: String,
      enum: Object.values(NotificationPurpose),
      required: true,
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true, strict: true }
);

const Notification: Model<INotification> = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);

export { Notification };
