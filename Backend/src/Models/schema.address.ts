import mongoose, { Schema, Model } from "mongoose";

export enum Provinces {
    PUNJAB = "Punjab",
    SINDH = "Sindh",
    BALOCHISTAN = "Balochistan",
    KHYBER = "Khyber Pakhtunkhwa",
    GILGIT = "Gilgit Baltistan"
}


export interface IAddress {
    fullname: string;
    phone: string;
    province: Provinces;
    city: string;
    street: string;
}

const addressSchema = new Schema<IAddress>({
    fullname: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    province: {
        type: String,
        enum: Object.values(Provinces),
        required: true
    },
    city: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    }
},{timestamps: true, strict: true})

const Address: Model<IAddress> = mongoose.model<IAddress>("AddressSchema", addressSchema);

export { Address };