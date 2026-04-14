import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    originalResponse: {
      type: String,
      required: true,
      trim: true,
    },
    claim: {
      type: String,
      required: true,
      trim: true,
    },
    verdict: {
      type: String,
      enum: ["verified", "false", "unverifiable"],
      default: "unverifiable",
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    evidence: [
      {
        title: String,
        snippet: String,
        url: String,
        score: Number,
      },
    ],
    reason: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const AuditLog =
  mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema);
