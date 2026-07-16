import mongoose, { Schema, Model } from "mongoose";

export interface INotification {
    title: string;
    purpose: string;
    message: string;
    createdAt: Date;
}

const notificationSchema = new Schema<INotification>({
    title: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{timestamps: true, strict: true})

const Notification: Model<INotification> = mongoose.model<INotification>("NotificationSchema", notificationSchema);

export { Notification };