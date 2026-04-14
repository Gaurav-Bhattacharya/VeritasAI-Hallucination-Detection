import mongoose from "mongoose";

const claimResultSchema = new mongoose.Schema(
  {
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
    reason: {
      type: String,
      default: "",
      trim: true,
    },
    evidence: [
      {
        score: Number,
        text: String,
        source: String,
      },
    ],
  },
  { _id: false },
);

const auditLogSchema = new mongoose.Schema(
  {
    originalResponse: {
      type: String,
      required: true,
      trim: true,
    },
    claims: [claimResultSchema],
  },
  {
    timestamps: true,
  },
);

export const AuditLog =
  mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema);
