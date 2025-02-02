import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash'
});

export const aiSummarizeCommit = async (diff: string) => {
  const response = await model.generateContent([
    `Please Summarize the following git commit diff file: \n\n${diff}`
  ])

  return response.response.text();
}