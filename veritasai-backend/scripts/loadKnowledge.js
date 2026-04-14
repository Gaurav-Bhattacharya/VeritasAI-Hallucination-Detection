import dotenv from "dotenv";
dotenv.config();

import { getEmbedding } from "../src/utils/embeddings.js";
import { getIndex } from "../src/config/pinecone.js";

const ingestData = async (documents) => {
  if (!Array.isArray(documents) || documents.length === 0) {
    console.log("No documents to ingest");
    return;
  }

  try {
    const index = getIndex();

    const vectors = await Promise.all(
      documents.map(async (doc, i) => {
        const embedding = await getEmbedding(doc);
        return {
          id: `doc-${i}-${Date.now()}`,
          values: embedding,
          metadata: {
            text: doc,
            source: "custom-dataset",
          },
        };
      }),
    );

    await index.upsert(vectors);
    console.log(`✅ Successfully ingested ${vectors.length} documents`);
  } catch (error) {
    console.error("Ingestion error:", error.message);
  }
};

const documents = [
  "The RBI repo rate as of February 2026 is 6.25 percent.",
  "Photosynthesis is the process by which plants convert sunlight into glucose.",
  "The capital of Australia is Canberra, not Sydney.",
  "Virat Kohli retired from Test cricket in January 2025.",
  "The speed of light is approximately 299,792 kilometers per second.",
  "India won the 2024 T20 World Cup by defeating South Africa in the final.",
  "OpenAI released GPT-4 in March 2023.",
  "The Great Wall of China is not visible from space with the naked eye.",
  "Water boils at 100 degrees Celsius at standard atmospheric pressure.",
  "The Amazon rainforest produces approximately 20 percent of the world's oxygen.",
  "The Eiffel Tower is located in Paris, France.",
  "Albert Einstein developed the theory of relativity.",
  "The human body has 206 bones.",
  "Mount Everest is the highest mountain in the world at 8,849 meters.",
  "The Indian Constitution came into effect on January 26, 1950.",
  "NASA was established in 1958.",
  "The Paris Agreement on climate change was signed in 2016.",
  "WhatsApp was acquired by Facebook in 2014 for approximately 19 billion dollars.",
  "Python was created by Guido van Rossum and first released in 1991.",
  "The COVID-19 pandemic was declared a global emergency by WHO in January 2020.",
];

ingestData(documents);
