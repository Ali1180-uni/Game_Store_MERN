import nodemailer from "nodemailer";
import { Transporter } from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);

dotenv.config({
    path: path.resolve(__dirname, "../.env")
});

const transporter:Transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for port 465
    auth: {
        user: process.env.USER, // Your Gmail address
        pass: process.env.PASS // Ensure this is a 16-character Google App Password!
    }
});

export { transporter };
