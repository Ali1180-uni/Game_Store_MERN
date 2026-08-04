import { IUser } from "../Models/schema.user.ts";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export {};