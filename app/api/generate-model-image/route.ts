import { NextResponse } from "next/server";
import { generateAIModelImage } from "../../../actions/replicate-actions";
import { getVersionId } from "../../../lib/replicate";

export const runtime = "edge";

export async function POST(request: Request) {
  const { prompt, modelId } = await request.json();

  // Create a new ReadableStream
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Send an initial response within 25 seconds
        controller.enqueue(
          encoder.encode(JSON.stringify({ status: "processing" }) + "\n")
        );

        // Get the version ID
        const versionId = await getVersionId(modelId);

        // Start the image generation process
        const output = await generateAIModelImage(prompt, versionId as any);

        // Send the final result
        controller.enqueue(
          encoder.encode(JSON.stringify({ imageUrl: output[0] }) + "\n")
        );
      } catch (error) {
        console.error("Error generating image:", error);
        controller.enqueue(
          encoder.encode(
            JSON.stringify({ error: "Failed to generate image" }) + "\n"
          )
        );
      } finally {
        controller.close();
      }
    },
  });

  // Return a streaming response
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

const encoder = new TextEncoder();
