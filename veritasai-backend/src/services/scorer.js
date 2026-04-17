import Groq from "groq-sdk";

let groqClient;

export const scoreClaim = async (claim, evidence) => {
  if (!groqClient) groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const groq = groqClient;

  // Prepare evidence text, but don't 'return' if it's empty
  const hasEvidence = Array.isArray(evidence) && evidence.length > 0;
  const evidenceText = hasEvidence
    ? evidence
        .map((e, i) => `${i + 1}. [Relevance: ${e.score}%] [Source: ${e.source}] ${e.text}`)
        .join("\n")
    : "No direct matches found in the local database.";

  try {
    const prompt = `
You are a professional Fact-Checking AI. Today's date is April 15, 2026.

Claim to Verify:
"${claim}"

Local Database Evidence:
${evidenceText}

Task:
Determine if the claim is true or false based on the provided evidence. 

IMPORTANT RULES:
1. If "Local Database Evidence" provides a clear answer, prioritize it.
2. If the local database is empty or unrelated, use your internal training data to verify common facts (e.g., Science, Geography, History).
3. If the claim is about a future event or something impossible to know, mark as "unverifiable".

Return ONLY a JSON object:
{
  "verdict": "verified" | "false" | "unverifiable",
  "confidence": number (0-100),
  "reason": "A brief explanation of why this verdict was chosen."
}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      messages: [{ role: "user", content: prompt }],
    });

    const output = completion.choices[0].message.content.trim();

    let parsed;
    try {
      // Handles cases where LLM wraps JSON in markdown code blocks
      const cleaned = output.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      throw new Error("Invalid JSON from LLM");
    }

    const validVerdicts = ["verified", "false", "unverifiable"];
    return {
      claim,
      verdict: validVerdicts.includes(parsed.verdict) ? parsed.verdict : "unverifiable",
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 20,
      reason: parsed.reason || "No explanation provided",
    };
  } catch (error) {
    console.error("Scoring error:", error.message);
    return {
      claim,
      verdict: "unverifiable",
      confidence: 20,
      reason: "LLM scoring failed or timed out",
    };
  }
};