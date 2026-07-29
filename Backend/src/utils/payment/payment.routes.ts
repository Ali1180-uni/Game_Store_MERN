import { Router } from "express";
import { createPayment } from "./payment.controller.ts";

const router = Router();

router.post("/create", createPayment);

router.post("/return", (req, res) => {
  res.json({
    message: "Return URL Working",
  });
});

export default router;