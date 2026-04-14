import express from "express";
import { factCheckResponse } from "../middleware/veritas.js";
import { AuditLog } from "../models/AuditLog.js";

const router = express.Router();

router.post("/verify", factCheckResponse);

router.get("/logs", async (req, res, next) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(50);

    res.status(200).json({
      status: "success",
      results: logs.length,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
