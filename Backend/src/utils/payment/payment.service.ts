import moment from "moment";
import { generateSecureHash } from "./generateHash.ts";

export const createPaymentData = (amount: number) => {

    const txnDateTime = moment().format("YYYYMMDDHHmmss");

    const expiry = moment()
        .add(1, "hour")
        .format("YYYYMMDDHHmmss");

    const txnRefNo = "T" + txnDateTime;

    const paymentData = {
        pp_Version: "1.1",
        pp_TxnType: "MWALLET",
        pp_Language: "EN",
        pp_TxnCurrency: "PKR",

        pp_MerchantID: process.env.JAZZCASH_MERCHANT_ID,

        pp_Password: process.env.JAZZCASH_PASSWORD,

        pp_TxnRefNo: txnRefNo,

        pp_Amount: amount * 100,

        pp_TxnDateTime: txnDateTime,

        pp_BillReference: "GameVault",

        pp_Description: "Game Purchase",

        pp_TxnExpiryDateTime: expiry,

        pp_ReturnURL: process.env.JAZZCASH_RETURN_URL
    };

    const secureHash = generateSecureHash(paymentData);

    return {
        ...paymentData,
        pp_SecureHash: secureHash
    };
};