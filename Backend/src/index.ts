import dotenv from "dotenv";
import express from "express";
import type { Express, Request, Response } from "express";

dotenv.config();

const app: Express = express();
const port = Number(process.env.PORT ?? 5000);

app.use(express.json());

app.get("/health", (req:Request, res:Response<{ok: boolean}>) => {
  res.json({ ok: true });
});

app.listen(port, (): void => {
  console.log(`Backend running on port ${port}`);
});