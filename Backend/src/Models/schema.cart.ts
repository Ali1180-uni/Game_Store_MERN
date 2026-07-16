import mongoose, { Schema, Model } from "mongoose";

export interface ICart {
  user: mongoose.Types.ObjectId;
  items: [
    {
      product: mongoose.Types.ObjectId;
      quantity: number;
    },
  ];
}

const cartSchema = new Schema<ICart>({
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
      quantity: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],
},{timestamps: true, strict: true});

const Cart: Model<ICart> = mongoose.model<ICart>("Cart", cartSchema);

export { Cart };
