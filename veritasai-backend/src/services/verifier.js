import { getIndex } from "../config/pinecone.js";
import { getEmbedding } from "../utils/embeddings.js";

/**
 * Verifies a single claim against the Pinecone Vector Database.
 */
export const verifyClaim = async (claim) => {
  if (!claim || typeof claim !== "string") {
    return { claim, evidence: [] };
  }

  try {
    // 1. Generate embedding for the incoming claim
    const vector = await getEmbedding(claim);
    if (!vector || vector.length === 0) {
      throw new Error("Embedding generation failed");
    }

    // 2. Query Pinecone
    const index = getIndex();
    const result = await index.query({
      vector,
      topK: 5, // Increased to 5 for better context coverage
      includeMetadata: true,
    });

    const matches = result.matches || [];

    // 3. Map and Filter Evidence
    // We only keep matches with a score > 0.4 to filter out random noise
    const evidence = matches
      .filter((match) => match.score > 0.4) 
      .map((match) => ({
        score: Math.round(match.score * 100), // Convert to percentage
        text: match.metadata?.text || "No content found",
        source: match.metadata?.source || "custom-dataset",
      }));

    // Debugging: Log what was found to the terminal
    if (evidence.length > 0) {
      console.log(`✅ Evidence found for "${claim.slice(0, 30)}...": ${evidence.length} matches.`);
    } else {
      console.log(`🔍 No relevant database evidence for: "${claim.slice(0, 30)}..."`);
    }

    return { claim, evidence };
  } catch (error) {
    console.error("❌ Verification Error:", error.message);
    return { claim, evidence: [] };
  }
};

/**
 * Batch verifies multiple claims.
 */
export const verifyClaims = async (claims) => {
  if (!Array.isArray(claims) || claims.length === 0) return [];
  
  // Running in parallel for speed
  return Promise.all(claims.map((claim) => verifyClaim(claim)));
};