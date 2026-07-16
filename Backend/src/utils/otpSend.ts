import { transporter } from "./mailsend.js";
import type { SentMessageInfo } from "nodemailer";

async function sendOtpEmail(
    to: string,
    sub: string,
    otp: string
): Promise<SentMessageInfo> {
    try {
        const info: SentMessageInfo = await transporter.sendMail({
            from: process.env.USER,
            to,
            subject: sub,
            text: `Your OTP is: ${otp}`,
        });

        console.log("Email successfully sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Nodemailer internal crash error:", error);
        throw error;
    }
}

export { sendOtpEmail };