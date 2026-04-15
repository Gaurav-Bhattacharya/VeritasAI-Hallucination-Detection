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

    const vectors = (
      await Promise.all(
        documents.map(async (doc, i) => {
          const embedding = await getEmbedding(doc);
          if (!embedding || embedding.length === 0) {
            console.warn(`⚠️  Skipping doc ${i} — embedding failed: "${doc.slice(0, 60)}..."`);
            return null;
          }
          return {
            id: `doc-${i}-${Date.now()}`,
            values: embedding,
            metadata: {
              text: doc,
              source: "custom-dataset",
            },
          };
        }),
      )
    ).filter(Boolean);

    if (vectors.length === 0) {
      console.error("❌ All embeddings failed — nothing to upsert");
      return;
    }

    // Pinecone recommends batches of 100
    const BATCH_SIZE = 100;
    for (let i = 0; i < vectors.length; i += BATCH_SIZE) {
      const batch = vectors.slice(i, i + BATCH_SIZE);
      await index.upsert(batch);
      console.log(`✅ Upserted batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} vectors)`);
    }

    console.log(`✅ Successfully ingested ${vectors.length}/${documents.length} documents`);
  } catch (error) {
    console.error("Ingestion error:", error.message);
    process.exit(1);
  }
};

const documents = [
  // India
  "India gained independence from British rule on August 15, 1947.",
  "The capital of India is New Delhi.",
  "The Indian Constitution came into effect on January 26, 1950.",
  "India won the 2024 T20 World Cup by defeating South Africa in the final.",
  "The RBI repo rate as of February 2026 is 6.25 percent.",
  "The Prime Minister of India as of 2024 is Narendra Modi.",
  "India is the most populous country in the world as of 2023.",
  "The national language of India is Hindi.",
  "Mumbai is the financial capital of India.",
  "The Taj Mahal is located in Agra, Uttar Pradesh, India.",

  // Science
  "Water boils at 100 degrees Celsius at standard atmospheric pressure.",
  "Water freezes at 0 degrees Celsius.",
  "The speed of light is approximately 299,792 kilometers per second.",
  "Photosynthesis is the process by which plants convert sunlight into glucose.",
  "The human body has 206 bones.",
  "DNA stands for Deoxyribonucleic Acid.",
  "The powerhouse of the cell is the mitochondria.",
  "Gravity on Earth is approximately 9.8 meters per second squared.",
  "The chemical formula for water is H2O.",
  "The chemical formula for carbon dioxide is CO2.",
  "Humans have 23 pairs of chromosomes.",
  "The nearest star to Earth is the Sun.",
  "The second nearest star to Earth is Proxima Centauri.",
  "Sound travels faster in water than in air.",
  "Light travels faster than sound.",

  // World Geography
  "The capital of Australia is Canberra, not Sydney.",
  "The capital of France is Paris.",
  "The capital of Japan is Tokyo.",
  "The capital of USA is Washington D.C., not New York.",
  "The capital of Canada is Ottawa, not Toronto.",
  "The capital of Brazil is Brasilia, not Rio de Janeiro.",
  "The Eiffel Tower is located in Paris, France.",
  "The Great Wall of China is not visible from space with the naked eye.",
  "Mount Everest is the highest mountain in the world at 8,849 meters.",
  "The Amazon river is the largest river by water flow in the world.",
  "The Nile is the longest river in the world.",
  "The Pacific Ocean is the largest ocean in the world.",
  "Russia is the largest country in the world by area.",
  "Vatican City is the smallest country in the world.",
  "Australia is both a country and a continent.",

  // Technology
  "Python was created by Guido van Rossum and first released in 1991.",
  "JavaScript was created by Brendan Eich in 1995.",
  "OpenAI released GPT-4 in March 2023.",
  "WhatsApp was acquired by Facebook in 2014 for approximately 19 billion dollars.",
  "Apple was founded by Steve Jobs, Steve Wozniak, and Ronald Wayne in 1976.",
  "Google was founded by Larry Page and Sergey Brin in 1998.",
  "Microsoft was founded by Bill Gates and Paul Allen in 1975.",
  "The first iPhone was released by Apple in 2007.",
  "Linux was created by Linus Torvalds in 1991.",
  "The World Wide Web was invented by Tim Berners-Lee in 1989.",
  "NASA was established in 1958.",
  "The first moon landing was on July 20, 1969 by Apollo 11.",

  // Sports
  "Virat Kohli retired from Test cricket in January 2025.",
  "Sachin Tendulkar scored 100 international centuries in cricket.",
  "Brazil has won the FIFA World Cup 5 times.",
  "The Olympic Games are held every 4 years.",
  "Roger Federer has won 20 Grand Slam titles.",
  "India won the Cricket World Cup in 1983 and 2011.",
  "Usain Bolt holds the world record for 100 meters at 9.58 seconds.",
  "Michael Jordan won 6 NBA championships with the Chicago Bulls.",

  // History
  "World War 2 ended in 1945.",
  "World War 1 started in 1914.",
  "The Berlin Wall fell in 1989.",
  "The French Revolution began in 1789.",
  "Christopher Columbus reached the Americas in 1492.",
  "The Titanic sank in April 1912.",
  "Albert Einstein developed the theory of relativity.",
  "Isaac Newton discovered the laws of motion and gravity.",
  "The COVID-19 pandemic was declared a global emergency by WHO in January 2020.",
  "The Paris Agreement on climate change was signed in 2016.",

  // Health
  "The normal human body temperature is 37 degrees Celsius.",
  "The human heart beats approximately 72 times per minute at rest.",
  "Adults need 7 to 9 hours of sleep per night.",
  "The human brain weighs approximately 1.4 kilograms.",
  "Vitamin C deficiency causes scurvy.",
  "The lungs are the primary organ for breathing in humans.",

  // Economics
  "The GDP of the United States is the largest in the world.",
  "India is the fifth largest economy in the world as of 2024.",
  "Bitcoin was created by Satoshi Nakamoto in 2009.",
  "The New York Stock Exchange is the largest stock exchange in the world.",
  "Inflation refers to the general increase in prices over time.",
  "The World Bank and IMF were established after World War 2.",
];

ingestData(documents);
