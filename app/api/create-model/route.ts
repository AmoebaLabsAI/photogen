import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
import Replicate from "replicate";
import JSZip from "jszip";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const OWNER = "amoebalabsai";
const TRAINING_VERSION = "885394e6a31c6f349dd4f9e6e7ffbabd8d9840ab2559ab78aed6b2451ab2cfef";

export async function POST(req: Request) {
  console.log("Starting POST request processing");
  const { userId } = auth();
  if (!userId) {
    console.log("Unauthorized access attempt");
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("Parsing form data");
    const formData = await req.formData();
    const files = formData.getAll('images') as File[];
    const triggerWord = formData.get('triggerWord') as string;

    console.log(`Received ${files.length} files and trigger word: "${triggerWord}"`);

    if (files.length === 0) throw new Error("No images uploaded");
    if (files.length > 20) throw new Error("Maximum 20 images allowed");
    if (!triggerWord) throw new Error("Trigger word is required");

    console.log("Creating zip file");
    const zip = new JSZip();
    await Promise.all(files.map(async (file, index) => {
      console.log(`Processing file ${index + 1}: ${file.name}`);
      const buffer = await file.arrayBuffer();
      zip.file(`image_${index + 1}.${file.name.split('.').pop()}`, buffer);
    }));
    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
    console.log("Zip file created successfully");

    const modelId = uuidv4();
    const modelName = `flux-${modelId}`;
    const s3Key = `model-training-images/${modelName}.zip`;

    console.log(`Uploading zip file to S3: ${s3Key}`);
    // Upload zip file to S3
    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: s3Key,
      Body: zipBuffer,
      ContentType: 'application/zip',
    }));
    console.log("Zip file uploaded to S3 successfully");

    const s3Url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
    console.log(`S3 URL: ${s3Url}`);

    console.log("Creating Replicate model");
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

    console.log("Starting model training");
    // Start the training
    const training = await replicate.trainings.create(
      "ostris",
      "flux-dev-lora-trainer",
      TRAINING_VERSION,
      {
        destination: `${OWNER}/${modelName}`,
        input: {
          input_images: s3Url,
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

    console.log("Returning success response");
    return NextResponse.json({ 
      success: true, 
      modelName, 
      triggerWord,
      trainingId: training.id 
    });
  } catch (error: any) {
    console.error("Error details:", error);
    return NextResponse.json({ message: error.message || "Server error" }, { status: 500 });
  }
}