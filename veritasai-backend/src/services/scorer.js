import Groq from "groq-sdk";

let groqClient;

export const scoreClaim = async (claim, evidence) => {
  if (!groqClient) groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const groq = groqClient;

  if (!Array.isArray(evidence) || evidence.length === 0) {
    return {
      claim,
      verdict: "unverifiable",
      confidence: 20,
      reason: "No relevant documents found",
    };
  }

  try {
    const evidenceText = evidence
      .map(
        (e, i) =>
          `${i + 1}. [Relevance: ${e.score}%] [Source: ${e.source}] ${e.text}`,
      )
      .join("\n");

    const prompt = `
You are a fact-checking system.

Claim:
"${claim}"

Evidence:
${evidenceText}

Task:
Decide whether the evidence:
- supports the claim
- contradicts the claim
- is unrelated to the claim

Rules:
- Return ONLY valid JSON
- No explanation outside JSON
- Format:
{
  "verdict": "verified | false | unverifiable",
  "confidence": number (0-100),
  "reason": "short explanation"
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
      const cleaned = output.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      throw new Error("Invalid JSON from LLM");
    }

    const validVerdicts = ["verified", "false", "unverifiable"];
    return {
      claim,
      verdict: validVerdicts.includes(parsed.verdict)
        ? parsed.verdict
        : "unverifiable",
      confidence:
        typeof parsed.confidence === "number" && parsed.confidence > 0
          ? parsed.confidence
          : 20,
    };
  } catch (error) {
    console.error("Scoring error:", error.message);
    return {
      claim,
      verdict: "unverifiable",
      confidence: 20,
      reason: "LLM scoring failed",
    };
  }
};
