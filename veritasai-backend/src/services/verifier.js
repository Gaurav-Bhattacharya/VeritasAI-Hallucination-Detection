import { getIndex } from "../config/pinecone.js";
import { getEmbedding } from "../utils/embeddings.js";

export const verifyClaim = async (claim) => {
  if (!claim || typeof claim !== "string") return null;

  try {
    const vector = await getEmbedding(claim);
    if (!vector || vector.length === 0) throw new Error("Embedding failed");

    const index = getIndex();
    const result = await index.query({
      vector,
      topK: 3,
      includeMetadata: true,
    });

    const matches = result.matches || [];

    const evidence = matches.map((match) => ({
      score: Math.round(match.score * 100),
      text: match.metadata?.text || "No content",
      source: match.metadata?.source || "unknown",
    }));

    return { claim, evidence };
  } catch (error) {
    console.error("Verification error:", error.message);
    return { claim, evidence: [] };
  }
};

export const verifyClaims = async (claims) => {
  if (!Array.isArray(claims) || claims.length === 0) return [];
  return Promise.all(claims.map((claim) => verifyClaim(claim)));
};
