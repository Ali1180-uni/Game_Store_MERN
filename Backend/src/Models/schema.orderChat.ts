import mongoose, { Schema, Model } from "mongoose";


export interface IOrderChat {
    orderID: mongoose.Types.ObjectId;
    message: [{
        sender: mongoose.Types.ObjectId;
        content: string;
        timestamp: Date;
    }]
}

const orderChatSchema = new Schema<IOrderChat>({
    orderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    message: [{
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserSchema",
            required: true
        },
        content: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            required: true
        }
    }]
},{timestamps: true, strict: true});

const OrderChat: Model<IOrderChat> = mongoose.model<IOrderChat>("OrderChat", orderChatSchema);

export { OrderChat };