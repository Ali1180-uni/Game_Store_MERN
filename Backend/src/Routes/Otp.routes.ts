// Routes/otp.routes.ts
import express from "express";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { sendOtpEmail } from "../utils/otpSend.ts";

const router = express.Router();
const OTP_SECRET = process.env.OTP_SECRET as string;

router.post("/send", async (req: Request, res: Response) => {
  try {
    const { email } = req.body as { email: string };
    if (!email) return res.status(400).json({ message: "Email is required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpToken = jwt.sign({ email, otp }, OTP_SECRET, { expiresIn: "60s" });

    await sendOtpEmail(email, "GameVault Verification Code", otp);

    res.json({ otpToken });
  } catch (err) {
    console.error("Failed to send OTP:", err);
    res.status(500).json({ message: "Failed to send verification code" });
  }
});

router.post("/verify", async (req: Request, res: Response) => {
  try {
    const { email, otp, otpToken } = req.body as { email: string; otp: string; otpToken: string };
    if (!email || !otp || !otpToken) {
      return res.status(400).json({ message: "Missing verification data" });
    }

    let decoded: { email: string; otp: string };
    try {
      decoded = jwt.verify(otpToken, OTP_SECRET) as { email: string; otp: string };
    } catch {
      return res.status(400).json({ message: "Code expired. Please request a new one." });
    }

    if (decoded.email !== email || decoded.otp !== otp) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    res.json({ verified: true });
  } catch (err) {
    res.status(400).json({ message: "Verification failed" });
  }
});

export default router;