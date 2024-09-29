import { NextResponse } from "next/server";
import { generateAIModelImage } from "../../../actions/replicate-actions";
import { getVersionId } from "../../../lib/replicate";

export const runtime = "edge";

export async function POST(request: Request) {
  const { prompt, modelId } = await request.json();

  try {
    // Get the version ID
    const versionId = await getVersionId(modelId);

    // Start the image generation process
    const generationPromise = generateAIModelImage(prompt, versionId as any);

    // Set up a timeout (adjust as needed)
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Image generation timed out")), 120000)
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
