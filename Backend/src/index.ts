import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import paymentRoutes from "./utils/payment/payment.routes.js";
import type { Express, Request, Response } from "express";

dotenv.config();

const app: Express = express();
const port: number = 5000;

app.use(express.json());
app.use(cors());
app.use("/api/payment", paymentRoutes);

app.get("/GameVault", (req:Request, res:Response<{ok: boolean}>) => {
  res.json({ ok: true });
});


app.listen(port, (): void => {
  console.log(`Backend running on port ${port}`);
});