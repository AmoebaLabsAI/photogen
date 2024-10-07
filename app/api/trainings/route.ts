import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const Replicate = require('replicate');

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function GET(request: NextRequest) {
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
}

export async function POST(request: Request) {
  // Your POST logic here
  // ...
}
