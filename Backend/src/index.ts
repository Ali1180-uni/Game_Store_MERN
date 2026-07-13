import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 5000);

app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({ ok: true });
});

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});