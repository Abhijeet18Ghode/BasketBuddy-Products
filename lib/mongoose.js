import mongoose from "mongoose";

export default async function mongooseConnection() {
  if (mongoose.connection.readyState === 1) {
    // If already connected, return the promise
    return mongoose.connection.asPromise();
  } else {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error("MongoDB URI is not defined in environment variables");
    }

    try {
      // Connect to MongoDB
      await mongoose.connect(uri);
      console.log("MongoDB connected successfully");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw error; // Re-throw the error after logging it
    }
  }
}
