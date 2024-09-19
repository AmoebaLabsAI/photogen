import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { sql } from "@vercel/postgres";
import { v4 as uuidv4 } from "uuid";
import Replicate from "replicate";
import JSZip from "jszip";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll('images') as File[];
    
    if (files.length === 0) throw new Error("No images uploaded");
    if (files.length > 10) throw new Error("Maximum 10 images allowed");

    const zip = new JSZip();

    await Promise.all(files.map(async (file, index) => {
      const buffer = await file.arrayBuffer();
      zip.file(`image_${index + 1}.${file.name.split('.').pop()}`, buffer);
    }));

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    const modelId = uuidv4();
    await sql`
      INSERT INTO models (id, user_id, created_at)
      VALUES (${modelId}, ${userId}, NOW())
    `;

    const replication = await replicate.models.create(
      "amoebalabsai",
      `test1dfsakjdsagjhz223`,
      {
        visibility: "public",
        hardware: "gpu-t4",
        description: `test1dfsakjdsagjhz223's Model`,
      }
    );

    console.log(`Model created: ${modelId}`);
    console.log(`Model URL: https://replicate.com/${userId}/${modelId}`);

    const creation = await replicate.trainings.create(
     "amoebalabsai", 
        "test1dfsakjdsagjhz223", 
        "ostris/flux-dev-lora-trainer:4ffd32160efd92e956d39c5338a9b8fbafca58e03f791f6d8011f3e20e8ea6fa", 
       {
        destination: "amoebalabsai/test1dfsakjdsagjhz223",
        input: {
            input_images: zipBuffer,
            steps: 100,
        }
        }
    );

    console.log(`Training started: ${creation.status}`);
    console.log(`Training URL: https://replicate.com/p/${creation.id}`);

    // Here you would typically send the zipBuffer to your training endpoint
    // or store it temporarily for later use

    return NextResponse.json({ success: true, replication, creation });
  } catch (error: any) {
    console.error("Error details:", error);
    return NextResponse.json({ message: error.message || "Server error" }, { status: 500 });
  }
}