import mongoose, { Mongoose } from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri: string | undefined = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error(
        "MONGODB_URI is not defined in the environment variables."
      );
    }

    const conn: Mongoose = await mongoose.connect(mongoUri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit the process with failure
  }
};

export { connectDB };
