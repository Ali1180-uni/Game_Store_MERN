import { Request, Response } from "express";
import { createPaymentData } from "./payment.service.ts";

export const createPayment = (
    req: Request,
    res: Response
) => {

    const payment = createPaymentData(5000);

    res.json(payment);
};