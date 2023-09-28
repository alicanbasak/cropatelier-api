import mongoose from "mongoose";

// This function is used to connect to MongoDB
const dbConnect = async () => {
  try {
    // Set strictQuery to true to prevent MongoDB from returning documents when the query conditions are not met
    mongoose.set("strictQuery", false);
    // Connect to MongoDB with MONGO_URI from .env
    const connected = await mongoose.connect(process.env.MONGO_URI);
    // Display a message when successfully connected to MongoDB
    console.log(`MongoDB connected: ${connected.connection.host}`);
  } catch (error) {
    // Display error message and exit with failure
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default dbConnect;
