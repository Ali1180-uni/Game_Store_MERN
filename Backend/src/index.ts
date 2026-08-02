import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import type { Express } from "express";
import productRoutes from "./Routes/product.routes.ts";

dotenv.config();

const app: Express = express();
const port: number = 5000;

app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

app.use("/products", productRoutes);


app.listen(port, (): void => {
  console.log(`Backend running on port ${port}`);
});