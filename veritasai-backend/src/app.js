import express from "express";
import cors from "cors";
import AppError from "./utils/AppError.js";
import proxyRouter from "./routes/proxy.js";

const app = express();

app.set("trust proxy", 1);

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);

// Body Parser
app.use(express.json());

// Routes
app.use("/api", proxyRouter);

// 404 fallback
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

// Global error middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
    });
  }

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
});

export default app;
