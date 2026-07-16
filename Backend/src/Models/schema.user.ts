import mongoose, { Schema, Model } from "mongoose";

export enum userRole {
  ADMIN = "Admin",
  EMPLOYEE = "Employee",
  CUSTOMER = "Customer",
}

export enum userBan {
  BAN = "Ban",
  NOBAN = "No Ban",
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: userRole;
  accountStatus: userBan;
  addresses: mongoose.Types.ObjectId[];
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(userRole),
    },
    accountStatus: {
      type: String,
      enum: Object.values(userBan),
    },
    addresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AddressSchema",
      },
    ],
  },
  { timestamps: true, strict: true }
);

const User: Model<IUser> = mongoose.model<IUser>("UserSchema", userSchema);

export { User };
