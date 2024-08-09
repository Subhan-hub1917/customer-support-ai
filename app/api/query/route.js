import { OpenAI } from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import { NextResponse } from 'next/server';

// Initialize Pinecone
const pc = new Pinecone({
  apiKey: process.env.NEXT_PINECONE_API,
});
const index = pc.index('kingsmen');


const generateStoreEmbeddings = async (data) => {
  const api = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_AIML_API, baseURL: 'https://api.aimlapi.com' });

  try {
    const queryResponse = await api.embeddings.create({
      input: data,
      model: 'text-embedding-3-small',
    });

    if (queryResponse) {
      return queryResponse.data[0].embedding;
    } else {
      throw new Error('Failed to generate embedding for query.');
    }
  } catch (error) {
  // console.error('Error generating embeddings for store:', error);
  }
}

export async function POST(req) {
  const { query } = await req.json();
  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  const embeddings = await generateStoreEmbeddings(query);
  // console.log(embeddings);
  try {
    // Query Pinecone with the generated embeddings
    const searchResults = await index.namespace('ns1').query({
      topK: 2, // Number of results to return
      vector: embeddings,
      includeMetadata: true, // Include metadata in the response if needed
    });

    // Return the search results to be used by the LLM
    return NextResponse.json({ results: searchResults }, { status: 200 });
  } catch (error) {
    // console.error('Error querying Pinecone:', error);
    return NextResponse.json({ error: 'Failed to query Pinecone' }, { status: 500 });
  }
}
