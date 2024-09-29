import { NextResponse } from "next/server";
import { generateAIModelImage } from "../../../actions/replicate-actions";
import { getVersionId } from "../../../lib/replicate";

export const runtime = "edge";

const MAX_TIMEOUT = 55000; // 55 seconds, just under Vercel's 60-second limit

export async function POST(request: Request) {
  const { prompt, modelId } = await request.json();

  try {
    // Get the version ID
    const versionId = await getVersionId(modelId);

    // Start the image generation process
    const generationPromise = generateAIModelImage(prompt, versionId as any);

    // Set up a timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("Image generation timed out")),
        MAX_TIMEOUT
      )
    );

    // Race between the generation and the timeout
    const output = await Promise.race([generationPromise, timeoutPromise]);

    return NextResponse.json({ imageUrl: (output as string[])[0] });
  } catch (error) {
    console.error("Error generating image:", error);
    if (error.message === "Image generation timed out") {
      return NextResponse.json(
        {
          error:
            "Image generation is taking longer than expected. Please try again.",
        },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
