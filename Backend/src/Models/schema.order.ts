import mongoose, { Schema, Model } from "mongoose";

export enum paymentMethod {
    JAZZCASH = "jazzCash",
    CASHONDELIVERY = "cashOnDelivery",
}

export enum paymentStatus {
    PENDING = "Pending",
    COMPLETED = "Completed",
    FAILED = "Failed"
}

export enum orderStatus {
    PENDING = "Pending",
    PROCESSING = "Processing",
    DELIVERED = "Delivered",
    CANCELLED = "Cancelled"
}

export interface IOrder {
    customer: mongoose.Types.ObjectId;
    items:[{
        product: mongoose.Types.ObjectId;
        quantity: number;
    }];
    paymentMethod: paymentMethod;
    paymentStatus: paymentStatus;
    orderStatus: orderStatus;
    shippingAddress: mongoose.Types.ObjectId;
    shippingCost: number;
    totalAmount: number;
    createdAt: Date;
}

const orderSchema = new Schema<IOrder>({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserSchema",
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    paymentMethod: {
        type: String,
        enum: paymentMethod,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: paymentStatus,
        required: true
    },
    orderStatus: {
        type: String,
        enum: orderStatus,
        required: true
    },
    shippingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AddressSchema",
        required: true
    },
    shippingCost: {
        type: Number,
        required: true,
        min: 0
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{timestamps: true, strict: true});

const Order: Model<IOrder> = mongoose.model<IOrder>("Order", orderSchema);

export { Order };