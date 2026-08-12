import express from "express";
import { Request, Response } from "express";
import { User, userBan } from "../Models/schema.user.ts";
import { protect } from "../Middleware/auth.middlewares.ts";
import { requireAdmin } from "../Middleware/admin.middleware.ts";
import { notifyUser } from "../utils/Notification/notify.ts";
import { NotificationPurpose } from "../Models/schema.notification.ts";
import { Product, ProductCategory } from "../Models/schema.products.ts";
import { Order } from "../Models/schema.order.ts";
import { Review } from "../Models/schema.reviews.ts";
import { upload } from "../Middleware/upload.ts";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.ts";
const MAX_STOCK = 20;

const router = express.Router();

router.get(
  "/stats",
  protect,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const [userCount, productCount, orderCount, reviewCount] =
        await Promise.all([
          User.countDocuments(),
          Product.countDocuments(),
          Order.countDocuments(),
          Review.countDocuments(),
        ]);
      res.json({ userCount, productCount, orderCount, reviewCount });
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  }
);

router.get(
  "/users",
  protect,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const users = await User.find().select("name email role accountStatus");
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  }
);

router.patch(
  "/users/:id/ban",
  protect,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { accountStatus: userBan.BAN },
        { new: true }
      );
      if (!user) return res.status(404).json({ message: "User not found" });

      await notifyUser(
        user._id,
        NotificationPurpose.BAN,
        "Account Suspended",
        "Your account has been banned. Contact support if you believe this is a mistake."
      );

      res.json({ message: "User banned" });
    } catch (err) {
      res.status(400).json({ message: "Failed to ban user" });
    }
  }
);

router.patch(
  "/users/:id/role",
  protect,
  requireAdmin,
  async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    const { role } = req.body as { role: string };
    const validRoles = ["Admin", "Employee", "Customer"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (String(req.params.id) === String(req.user._id) && role !== "Admin") {
      return res
        .status(400)
        .json({ message: "You can't remove your own admin access" });
    }

    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true }
      ).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (err) {
      res.status(400).json({ message: "Failed to update role" });
    }
  }
);

const toNumber = (value: unknown) => {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? Number.NaN : parsed;
  }
  return Number.NaN;
};

const parseDetails = (value: unknown) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }
  return null;
};

const validateProductBody = (body: any) => {
  const { title, description, price, category, stock, details } = body;

  if (!title || !description) return "Missing required fields";

  const parsedPrice = Number(price);
  if (isNaN(parsedPrice) || parsedPrice < 0) return "Invalid price";

  if (!Object.values(ProductCategory).includes(category))
    return "Invalid category";

  const parsedStock = Number(stock);
  if (isNaN(parsedStock) || parsedStock < 0 || parsedStock > MAX_STOCK) {
    return `Stock must be between 0 and ${MAX_STOCK}`;
  }

  let parsedDetails;
  try {
    parsedDetails = typeof details === "string" ? JSON.parse(details) : details;
  } catch {
    return "Invalid details format";
  }
  if (!Array.isArray(parsedDetails) || parsedDetails.length === 0)
    return "Missing product details";

  return null;
};

router.get(
  "/products",
  protect,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  }
);

router.post(
  "/products",
  protect,
  requireAdmin,
  upload.single("image"),
  async (req: Request, res: Response) => {
    const error = validateProductBody(req.body);
    if (error) return res.status(400).json({ message: error });

    try {
      const { title, description, price, category, stock } = req.body;
      const details = JSON.parse(req.body.details);

      const imageUrl = req.file
        ? await uploadToCloudinary(req.file.buffer, "products")
        : req.body.image;
      if (!imageUrl)
        return res.status(400).json({ message: "Image is required" });

      const product = await Product.create({
        title,
        description,
        image: imageUrl,
        price: Number(price),
        category,
        stock: Number(stock),
        details,
        isAvailable: Number(stock) > 0,
      });

      res.status(201).json(product);
    } catch (err) {
      res.status(400).json({ message: "Failed to create product" });
    }
  }
);

router.put(
  "/products/:id",
  protect,
  requireAdmin,
  upload.single("image"),
  async (req: Request, res: Response) => {
    const error = validateProductBody(req.body);
    if (error) return res.status(400).json({ message: error });

    try {
      const { title, description, price, category, stock } = req.body;
      const details = JSON.parse(req.body.details);
      const imageUrl = req.file
        ? await uploadToCloudinary(req.file.buffer, "products")
        : req.body.image;

      const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
          title,
          description,
          image: imageUrl,
          price: Number(price),
          category,
          stock: Number(stock),
          details,
          isAvailable: Number(stock) > 0,
        },
        { new: true, runValidators: true }
      );

      if (!product) return res.status(404).json({ message: "Product not found" });
      res.json(product);
    } catch (err) {
      res.status(400).json({ message: "Failed to update product" });
    }
  }
);

router.patch(
  "/products/:id/stock",
  protect,
  requireAdmin,
  async (req: Request, res: Response) => {
    const { stock } = req.body as { stock: number };

    if (typeof stock !== "number" || stock < 0 || stock > MAX_STOCK) {
      return res
        .status(400)
        .json({ message: `Stock must be between 0 and ${MAX_STOCK}` });
    }

    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { stock, isAvailable: stock > 0 },
        { new: true }
      );
      if (!product)
        return res.status(404).json({ message: "Product not found" });
      res.json(product);
    } catch (err) {
      res.status(400).json({ message: "Failed to update stock" });
    }
  }
);

router.delete(
  "/products/:id",
  protect,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product)
        return res.status(404).json({ message: "Product not found" });
      res.json({ message: "Product deleted" });
    } catch (err) {
      res.status(400).json({ message: "Failed to delete product" });
    }
  }
);

router.put(
  "/users/:id",
  protect,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const { name, email } = req.body as { name: string; email: string };
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { name, email },
        { new: true, runValidators: true }
      ).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (err: any) {
      if (err.code === 11000) {
        return res.status(409).json({ message: "Email is already in use" });
      }
      res.status(400).json({ message: "Failed to update user" });
    }
  }
);

router.delete(
  "/users/:id",
  protect,
  requireAdmin,
  async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    if (String(req.params.id) === String(req.user._id)) {
      return res
        .status(400)
        .json({ message: "You can't delete your own account" });
    }

    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json({ message: "User deleted" });
    } catch (err) {
      res.status(400).json({ message: "Failed to delete user" });
    }
  }
);

router.get(
  "/users/:id/reviews",
  protect,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const reviews = await Review.find({ user: req.params.id })
        .populate("product", "title image")
        .sort({ createdAt: -1 });
      res.json(reviews);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch user's reviews" });
    }
  }
);

// Fetch all reviews (admin)
router.get(
  "/reviews",
  protect,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const reviews = await Review.find()
        .populate("user", "name email")
        .populate("product", "title image")
        .sort({ createdAt: -1 });
      res.json(reviews);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  }
);

// Update a review (admin)
router.put(
  "/reviews/:id",
  protect,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const { rating, comment } = req.body as {
        rating?: number;
        comment?: string;
      };

      const update: any = {};
      if (typeof rating === "number") update.rating = rating;
      if (typeof comment === "string") update.comment = comment;

      const review = await Review.findByIdAndUpdate(req.params.id, update, {
        new: true,
        runValidators: true,
      });
      if (!review) return res.status(404).json({ message: "Review not found" });
      res.json(review);
    } catch (err) {
      res.status(400).json({ message: "Failed to update review" });
    }
  }
);

// Delete a review (admin)
router.delete(
  "/reviews/:id",
  protect,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const review = await Review.findByIdAndDelete(req.params.id);
      if (!review) return res.status(404).json({ message: "Review not found" });
      res.json({ message: "Review deleted" });
    } catch (err) {
      res.status(400).json({ message: "Failed to delete review" });
    }
  }
);

router.patch(
  "/users/:id/status",
  protect,
  requireAdmin,
  async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    const { accountStatus } = req.body as { accountStatus: "Ban" | "No Ban" };
    if (!["Ban", "No Ban"].includes(accountStatus)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    if (String(req.params.id) === String(req.user._id)) {
      return res
        .status(400)
        .json({ message: "You can't ban your own account" });
    }

    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { accountStatus },
        { new: true }
      ).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });

      await notifyUser(
        user._id,
        NotificationPurpose.BAN,
        accountStatus === "Ban" ? "Account Suspended" : "Account Reinstated",
        accountStatus === "Ban"
          ? "Your account has been suspended. Contact support if you believe this is a mistake."
          : "Your account access has been restored. Welcome back!"
      );

      res.json(user);
    } catch (err) {
      res.status(400).json({ message: "Failed to update account status" });
    }
  }
);

router.post(
  "/notifications",
  protect,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const { userId, title, message } = req.body as {
        userId: string;
        title: string;
        message: string;
      };

      const notification = await notifyUser(
        userId,
        NotificationPurpose.ADMIN,
        title,
        message
      );
      res.status(201).json(notification);
    } catch (err) {
      res.status(400).json({ message: "Failed to send notification" });
    }
  }
);

export default router;
