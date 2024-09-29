import Replicate from "replicate";
import { NextRequest, NextResponse } from "next/server";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Replace the generic handler with a named export for the GET method
export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const trainingID = searchParams.get("trainingID");

  if (!trainingID) {
    return NextResponse.json(
      { error: "Training ID is required" },
      { status: 400 }
    );
  }

  try {
    const training = await replicate.trainings.get(trainingID);

    const versionId = training.output.version;

    return NextResponse.json({ versionId });
  } catch (error) {
    console.error("Error fetching training:", error);
    return NextResponse.json(
      { error: "Failed to fetch training" },
      { status: 500 }
    );
  }
};
