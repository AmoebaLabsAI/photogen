import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Prevent Next.js / Vercel from caching responses
// See https://github.com/replicate/replicate-javascript/issues/136#issuecomment-1728053102
replicate.fetch = (url, options) => {
  return fetch(url, { ...options, cache: "no-store" });
};

// In production and preview deployments (on Vercel), the VERCEL_URL environment variable is set.
// In development (on your local machine), the NGROK_HOST environment variable is set.
const WEBHOOK_HOST = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.NGROK_HOST;

export async function POST(request) {
  if (!process.env.REPLICATE_API_TOKEN) {
    return NextResponse.json({ detail: 'REPLICATE_API_TOKEN is not set' }, { status: 500 });
  }

  try {
    const { prompt } = await request.json();

    const response = await replicate.run(
      "black-forest-labs/flux-schnell",
      {
        input: {
          prompt: prompt
        }
      }
    );

    // The response is now an array of image URLs
    if (!response || response.length === 0) {
      return NextResponse.json({ detail: 'No images generated' }, { status: 500 });
    }

    // Return the first image URL (or you could return all of them)
    return NextResponse.json({ image: response[0] }, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ detail: error.message || 'An error occurred' }, { status: 500 });
  }
}