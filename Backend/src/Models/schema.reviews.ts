import mongoose, { Schema, Model } from "mongoose";


export interface IReview {
    user: mongoose.Types.ObjectId;
    product: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
}

const reviewSchema = new Schema<IReview>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserSchema",
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{timestamps: true, strict: true});

const Review: Model<IReview> = mongoose.model<IReview>("Review", reviewSchema);

export { Review };