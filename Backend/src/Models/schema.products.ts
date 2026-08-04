import mongoose, { Schema, Model } from "mongoose";

// Replaced enum with a const object to avoid TypeScript enum issues in newer Node versions
export const ProductCategory = {
  GAME: "Game",
  ACCESSORY: "Accessories",
} as const;

// Create a type from the object values
export type ProductCategoryType = typeof ProductCategory[keyof typeof ProductCategory];

// Interface for the Product document
export interface IProduct {
  title: string;
  description: string;
  image: string;
  price: number;
  isAvailable: boolean;
  category: ProductCategoryType;
  stock: number;
  details: [
    {
      gameType: string;
      preOrder: boolean;
      preOrderReleaseDate?: Date | null;
      platform: string;
      brand: string;
    }
  ];
}

// Defining the Product Schema
const productSchema = new Schema<IProduct>(
  {
    title: {
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
          required: false,
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
  },
  { timestamps: true, strict: true }
);

// Creating the Product Model
const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);

export { Product, productSchema };