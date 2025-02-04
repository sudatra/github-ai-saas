'use server'

import { streamText } from 'ai';
import { createStreamableValue } from 'ai/rsc';
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateVectorEmbedding } from '@/lib/gemini';
import { db } from '@/server/db';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY
});

export const askQuestion = async (question: string, projectId: string) => {
  const stream = createStreamableValue();
  const queryVector = await generateVectorEmbedding(question);
  const vectorQuery = `[${queryVector.join(',')}]`;

  const result = await db.$queryRaw`
    SELECT "fileName", "sourceCode", "summary", 
    1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity
    FROM "SourceCodeEmbedding"
    WHERE 1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) > 0.5 AND "projectId" = ${projectId}
    ORDER BY similarity DESC
    LIMIT 10
  ` as { fileName: string, sourceCode: string, summary: string, similarity: number }[];

  let context = '';
  for(const doc of result) {
    context += `source: ${doc.fileName}\ncode content: ${doc.sourceCode}\nsummary of file: ${doc.summary}\n`;
  }

  (async () => {
    const { textStream } = await streamText({
      model: google('gemini-1.5-flash'),
      prompt: `
        START CONTEXT BLOCK
        ${context}
        END CONTEXT BLOCK

        START QUESTION
        ${question}
        END QUESTION

        Take into account the context block that has been provided in this conversation.
        If unable to provide an answer say "Sorry unable to find an appropriate answer to your question".
        Do not draw things directly from internet.
        Answer the question in a markdown syntax, with code snippets if needed. Be as detailed as possible.
      `
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return {
    output: stream,
    fileReferences: result
  }
}