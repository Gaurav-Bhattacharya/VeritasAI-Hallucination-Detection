import { Pinecone } from "@pinecone-database/pinecone";

let pinecone;

export const getIndex = () => {
  if (!pinecone) {
    pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
  }
  return pinecone.index(process.env.PINECONE_INDEX);
};
