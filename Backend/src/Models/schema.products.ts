import mongoose, { Schema, Model } from "mongoose";

export enum ProductCategory {
  GAME = "Game",
  ACCESSORY = "Accessories",
}

export interface IProduct {
  name: string;
  description: string;
  image: string;
  price: number;
  isAvailable: boolean;
  category: ProductCategory;
  stock: number;
  details: [
    {
      gameType: string;
      preOrder: boolean;
      preOrderReleaseDate: Date;
      platform: string;
      brand: string;
    },
  ];
}

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  isAvailable: {
    type: Boolean,
    required: true,
  },
  category: {
    type: String,
    enum: Object.values(ProductCategory),
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  details: [
    {
      gameType: {
        type: String,
        required: true,
      },
      preOrder: {
        type: Boolean,
        required: true,
      },
      preOrderReleaseDate: {
        type: Date,
        required: true,
      },
      platform: {
        type: String,
        required: true,
      },
      brand: {
        type: String,
        required: true,
      },
    },
  ],
},{timestamps: true, strict: true});

const Product: Model<IProduct> = mongoose.model<IProduct>(
  "Product",
  productSchema
);

export { Product };
