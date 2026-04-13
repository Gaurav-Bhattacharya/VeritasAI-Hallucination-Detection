//  Entry point. Starts Express server.
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import proxyRouter from "./src/routes/proxy.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api", proxyRouter);

// Health check
app.get("/", (req, res) => {
  res.json({ status: "VeritasAI middleware is running" });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});