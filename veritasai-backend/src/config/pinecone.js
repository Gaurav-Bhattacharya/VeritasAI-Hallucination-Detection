import { Pinecone } from "@pinecone-database/pinecone";

export const getIndex = () => {
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });
  return pinecone.index(process.env.PINECONE_INDEX);
};
