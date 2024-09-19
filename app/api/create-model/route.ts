import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
import Replicate from "replicate";
import JSZip from "jszip";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const OWNER = "amoebalabsai";
const TRAINING_VERSION = "885394e6a31c6f349dd4f9e6e7ffbabd8d9840ab2559ab78aed6b2451ab2cfef";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll('images') as File[];
    const triggerWord = formData.get('triggerWord') as string;

    if (files.length === 0) throw new Error("No images uploaded");
    if (files.length > 20) throw new Error("Maximum 20 images allowed");
    if (!triggerWord) throw new Error("Trigger word is required");

    const zip = new JSZip();
    await Promise.all(files.map(async (file, index) => {
      const buffer = await file.arrayBuffer();
      zip.file(`image_${index + 1}.${file.name.split('.').pop()}`, buffer);
    }));
    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    const modelId = uuidv4();
    const modelName = `flux-${modelId}`;

    // Create the model
    const model = await replicate.models.create(
      OWNER,
      modelName,
      {
        visibility: "public",
        hardware: "gpu-t4",
        description: "A fine-tuned FLUX.1 model",
      }
    );

    console.log(`Model created: ${modelName}`);
    console.log(`Model URL: https://replicate.com/${OWNER}/${modelName}`);

    // Start the training
    const training = await replicate.trainings.create(
      "ostris",
      "flux-dev-lora-trainer",
      TRAINING_VERSION,
      {
        destination: `${OWNER}/${modelName}`,
        input: {
          input_images: "https://efrosgans.eecs.berkeley.edu/cyclegan/datasets/mini.zip",
          steps: 1000,
          trigger_word: triggerWord,
          learning_rate: 0.0004,
          batch_size: 1,
          resolution: "512,768,1024",
          autocaption: true,
          lora_rank: 16,
          optimizer: "adamw8bit",
          wandb_project: "flux_train_replicate",
          wandb_save_interval: 100,
          caption_dropout_rate: 0.05,
          cache_latents_to_disk: false,
          wandb_sample_interval: 100
        },
      }
    );

    console.log(`Training started: ${training.status}`);
    console.log(`Training URL: https://replicate.com/p/${training.id}`);

    return NextResponse.json({ success: true, model, training });
  } catch (error: any) {
    console.error("Error details:", error);
    return NextResponse.json({ message: error.message || "Server error" }, { status: 500 });
  }
}

// Remove the separate trainModel function as it's no longer needed