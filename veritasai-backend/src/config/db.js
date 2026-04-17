import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
// Load it again here to be absolutely safe
dotenv.config();

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("❌ MONGODB_URI is not set in .env file.");
    // For a hackathon demo, if the .env is failing, you can hardcode it here
    // but only as a last resort!
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("✅ DB connected successfully");
  } catch (error) {
    console.log("❌ DB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;