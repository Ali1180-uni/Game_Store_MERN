import express from "express";
import { Review } from "../Models/schema.reviews.ts";
import { protect } from "../Middleware/auth.middlewares.ts";
import { Request, Response } from "express";

const router = express.Router();

router.get("/:productId", async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "name")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
});

router.post("/", protect, async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const { productId, rating, comment } = req.body;
    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating,
      comment,
    });
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: "Failed to submit review" });
  }
});

export default router;
