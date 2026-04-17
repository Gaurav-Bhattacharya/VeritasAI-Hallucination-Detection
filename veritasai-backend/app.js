import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import AppError from "./src/utils/AppError.js";
import proxyRouter from "./src/routes/proxy.js";

const app = express();

// Trust proxy (needed behind reverse proxies like Nginx, Railway, Render)
app.set("trust proxy", 1);

// Security headers
app.use(helmet());

// Request logging — concise in production, verbose in dev
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Gzip compression for all responses
app.use(compression());

// Rate limiting — prevent abuse on the verify endpoint
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "fail",
    message: "Too many requests — please try again later",
  },
});

// CORS
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((url) => url.trim());

app.use(
  cors({
    origin:'*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

// Body parser
app.use(express.json({ limit: "1mb" }));

// Health check — useful for uptime monitors and load balancers
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

// Routes
app.use("/api", apiLimiter, proxyRouter);

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

  console.error("UNEXPECTED ERROR:", err);
  return res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
});

export default app;
