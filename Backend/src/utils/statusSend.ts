import { transporter } from "./mailsend.js";
import type { SentMessageInfo } from "nodemailer";

async function StatusEmail(
    to: string,
    sub: string,
    status: string
): Promise<SentMessageInfo> {
    try {
        const info: SentMessageInfo = await transporter.sendMail({
            from: process.env.USER,
            to,
            subject: sub,
            text: `The status of your order is: ${status}`,
        });

        console.log("Email successfully sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Nodemailer internal crash error:", error);
        throw error;
    }
}

export { StatusEmail };