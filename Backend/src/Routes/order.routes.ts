import express from "express";
import { Request, Response } from "express";
import { Order, paymentMethod as PaymentMethodEnum, paymentStatus as PaymentStatusEnum, orderStatus as OrderStatusEnum } from "../Models/schema.order.ts";
import { Product } from "../Models/schema.products.ts";
import { protect } from "../Middleware/auth.middlewares.ts";

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

    let totalAmount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(400)
          .json({ message: `Product ${item.product} not found` });
      }
      totalAmount += product.price * item.quantity;
    }
    totalAmount += SHIPPING_COST;

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
