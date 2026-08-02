import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri: string | undefined = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error(
        "MONGODB_URI is not defined in the environment variables."
      );
    }

    await mongoose
      .connect(mongoUri)
      .then(() => {
        console.log("Connected to MongoDB");
      })
      .catch((err: Error) => {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
      });
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit the process with failure
  }
};

export { connectDB };
