import express from "express";
import { Request, Response } from "express";
import {
  Order,
  paymentMethod as PaymentMethodEnum,
  paymentStatus as PaymentStatusEnum,
  orderStatus as OrderStatusEnum,
} from "../Models/schema.order.ts";
import { Product } from "../Models/schema.products.ts";
import { protect } from "../Middleware/auth.middlewares.ts";
import { notifyUser } from "../utils/Notification/notify.ts";
import { NotificationPurpose } from "../Models/schema.notification.ts";

const router = express.Router();
const SHIPPING_COST = 0;

router.post("/", protect, async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Not authorized" });

  try {
    const { items, shippingAddress, paymentMethod } = req.body as {
      items: { product: string; quantity: number }[];
      shippingAddress: string;
      paymentMethod: PaymentMethodEnum;
    };

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Order must contain at least one item" });
    }

    for (const item of items) {
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        return res.status(400).json({ message: "Each item quantity must be at least 1" });
      }
    }

    let totalAmount = 0;
    const inventoryUpdates: { productId: string; quantity: number }[] = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(400)
          .json({ message: `Product ${item.product} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(409).json({
          message: `${product.title} only has ${product.stock} item(s) left in stock`,
        });
      }

      totalAmount += product.price * item.quantity;
      inventoryUpdates.push({ productId: String(product._id), quantity: item.quantity });
    }
    totalAmount += SHIPPING_COST;

    const updatedProducts: { productId: string; quantity: number }[] = [];
    try {
      for (const update of inventoryUpdates) {
        const updated = await Product.findOneAndUpdate(
          { _id: update.productId, stock: { $gte: update.quantity } },
          { $inc: { stock: -update.quantity } },
          { new: true }
        );

        if (!updated) {
          throw new Error("STOCK_CONFLICT");
        }

        updatedProducts.push(update);

        if (updated.stock <= 0 && updated.isAvailable) {
          updated.isAvailable = false;
          await updated.save();
        }
      }
    } catch (err) {
      for (const rollback of updatedProducts) {
        await Product.findByIdAndUpdate(rollback.productId, { $inc: { stock: rollback.quantity } });
      }
      return res.status(409).json({ message: "Some products are out of stock. Please refresh your cart." });
    }

    const order = await Order.create({
      customer: req.user._id,
      items,
      paymentMethod,
      paymentStatus: PaymentStatusEnum.PENDING,
      orderStatus: OrderStatusEnum.PENDING,
      shippingAddress,
      shippingCost: SHIPPING_COST,
      totalAmount,
    });

    await notifyUser(
      req.user._id,
      NotificationPurpose.ORDER,
      "Order Placed",
      `Your order #${order._id} has been placed successfully. Total: $${totalAmount.toFixed(2)}.`
    );

    const populated = await Order.findById(order._id)
      .populate("items.product")
      .populate("shippingAddress");

    res.status(201).json(populated);
  } catch (err) {
    console.error("Failed to create order:", err);
    res.status(400).json({ message: "Failed to create order" });
  }
});

router.get("/:id", protect, async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Not authorized" });

  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product")
      .populate("shippingAddress");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (String(order.customer) !== String(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (err) {
    res.status(400).json({ message: "Invalid order id" });
  }
});

export default router;
