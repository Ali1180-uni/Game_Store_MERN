import express from "express";
import { Request, Response } from "express";
import { Product, ProductCategory } from "../Models/schema.products.ts";
import { connectDB } from "../Models/db.connect.ts";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    try {
      const category = typeof req.query.category === "string" ? req.query.category.trim().toLowerCase() : "";
      const filter =
        category === "games" || category === "game"
          ? { category: ProductCategory.GAME }
          : category === "accessories" || category === "accessory"
            ? { category: ProductCategory.ACCESSORY }
            : undefined;

      const products = await Product.find(filter);
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: "Invalid product id" });
  }
});

connectDB().then(() => {
    console.log("Connected to MongoDB and server is ready to handle requests.");
}).catch((err) => {
  console.error('Failed to Connect to MongoDB:', err);
});

export default router;

