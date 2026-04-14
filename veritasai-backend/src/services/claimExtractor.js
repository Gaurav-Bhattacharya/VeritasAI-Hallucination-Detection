import Groq from "groq-sdk";

export const extractClaims = async (llmResponse) => {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
  try {
    const prompt = `
Extract all factual claims from the following text.

Rules:
- Return ONLY a valid JSON array
- No explanation, no extra text
- Example: ["claim 1", "claim 2"]

Text:
${llmResponse}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      messages: [{ role: "user", content: prompt }],
    });

    const output = completion.choices[0].message.content.trim();

    try {
      const cleaned = output.replace(/```json|```/g, "").trim();
      return JSON.parse(cleaned);
    } catch {
      console.warn("Raw output was:", output);
      return [];
    }
  } catch (error) {
    console.error("Groq error:", error.message);
    return [];
  }
};
