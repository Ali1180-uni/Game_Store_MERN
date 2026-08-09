import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import type { Express } from "express";
import productRoutes from "./Routes/product.routes.ts";
import AuthRoutes from "./Routes/Auth.routes.ts";
import ReviewsRoutes from "./Routes/Reviews.routes.ts";
import addressRoutes from "./Routes/Address.routes.ts";
import orderRoutes from "./Routes/order.routes.ts";
import notificationRoutes from "./Routes/Notification.routes.ts";
import adminRoutes from "./Routes/Admin.routes.ts";

dotenv.config();

const app: Express = express();
const port: number = 5000;

app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['x-refreshed-token'], // ← required, or JS can't read this header at all
  credentials: true
};

app.use(cors(corsOptions));

app.use("/products", productRoutes);
app.use("/reviews", ReviewsRoutes);
app.use("/addresses", addressRoutes);
app.use("/orders", orderRoutes);
app.use("/notifications", notificationRoutes);
app.use("/admin", adminRoutes);
app.use("/auth", AuthRoutes);

app.listen(port, (): void => {
  console.log(`Backend running on port ${port}`);
});