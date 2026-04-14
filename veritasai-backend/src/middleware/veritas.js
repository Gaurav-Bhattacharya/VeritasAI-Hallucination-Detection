import { verifyClaims } from "../services/verifier.js";
import { scoreClaim } from "../services/scorer.js";
import { AuditLog } from "../models/AuditLog.js";

export const factCheckResponse = async (req, res, next) => {
  try {
    const { llmResponse } = req.body;

    if (!llmResponse) {
      return res.status(400).json({
        status: "fail",
        message: "llmResponse is required",
      });
    }

    // 1. Extract claims
    const claims = await extractClaims(llmResponse);

    if (claims.length === 0) {
      return res.status(200).json({
        status: "success",
        data: {
          claims: [],
          message: "No factual claims found in the response",
        },
      });
    }

    // 2. Verify claims — vector search → evidence
    const verifiedResults = await verifyClaims(claims);

    // 3. Score each claim — LLM reasoning → verdict
    const finalResults = await Promise.all(
      verifiedResults.map(async (item) => {
        const scored = await scoreClaim(item.claim, item.evidence);
        return {
          claim: item.claim,
          verdict: scored.verdict,
          confidence: scored.confidence,
          reason: scored.reason,
          evidence: item.evidence,
        };
      })
    );

    // 4. Save to MongoDB
    const audit = await AuditLog.create({
      originalResponse: llmResponse,
      claims: finalResults,
    });

    // 5. Return response
    return res.status(200).json({
      status: "success",
      data: {
        claims: finalResults,
        auditId: audit._id,
      },
    });

  } catch (error) {
    next(error);
  }
};