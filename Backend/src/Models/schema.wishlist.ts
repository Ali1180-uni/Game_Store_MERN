import mongoose, { Schema, Model } from "mongoose";

export interface IWishlist {
  user: mongoose.Types.ObjectId;
  items: [
    {
      product: mongoose.Types.ObjectId;
    },
  ];
}

const wishlistSchema = new Schema<IWishlist>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserSchema",
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    },
  ],
},{timestamps: true, strict: true});

const Wishlist: Model<IWishlist> = mongoose.model<IWishlist>(
  "Wishlist",
  wishlistSchema
);

export { Wishlist };
