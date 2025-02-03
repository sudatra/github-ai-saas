import { GoogleGenerativeAI } from '@google/generative-ai';
import { Document } from '@langchain/core/documents';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash'
});

export const aiSummarizeCommit = async (diff: string) => {
  try {
    const response = await model.generateContent([
      `Please Summarize the following git commit diff file: \n\n${diff}`
    ])
  
    return response.response.text();
  }
  catch(error) {
    return '';
  }
}

export const summarizeCode = async (doc: Document) => {
  try {
    console.log(`getting summary for ${doc.metadata.source}`)
    const code = doc.pageContent.slice(0, 10000);
    const response = await model.generateContent([
      `You are an experienced software engineer onboarding someone in your team, and you want to explain to them the purpose of the ${doc.metadata.source} file.
      Here is the code:
      ---
      ${code}
      ---
      Give a summary in no more than 100 words for the above code.
      `
    ])
  
    return response.response.text();
  }
  catch(error) {
    return '';
  }
}

export const generateVectorEmbedding = async (summary: string) => {
  const model = genAI.getGenerativeModel({
    model: 'text-embedding-004'
  });

  const result = await model.embedContent(summary);
  const embedding = result.embedding;

  return embedding.values
}