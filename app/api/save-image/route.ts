import { sql } from "@vercel/postgres";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

// Initialize S3 client with AWS credentials
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  // Get user ID from Clerk authentication
  const { userId } = auth();
  // Extract imageUrl from request body
  const { imageUrl } = await request.json();

  // Validate required data
  if (!userId || !imageUrl) {
    return NextResponse.json(
      { error: "Missing required data" },
      { status: 400 }
    );
  }

  try {
    // Increment user's image count and get the new count
    const countResult = await sql`
      INSERT INTO user_image_counts (user_id, image_count)
      VALUES (${userId}, 1)
      ON CONFLICT (user_id)
      DO UPDATE SET image_count = user_image_counts.image_count + 1
      RETURNING image_count
    `;

    const imageCount = countResult.rows[0].image_count;

    // Check if user has reached the image generation limit
    if (imageCount > 5) {
      return NextResponse.json(
        { error: "Image generation limit reached" },
        { status: 403 }
      );
    }

    // Fetch the image from the provided URL
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error("Failed to fetch image");
    }
    const imageBuffer = await imageResponse.arrayBuffer();

    // Generate a unique filename for S3
    const fileExtension = imageUrl.split(".").pop();
    const filename = `${uuidv4()}.${fileExtension}`;

    // Prepare upload parameters for S3
    const uploadParams = {
      Bucket: process.env.AWS_SAVED_IMAGES_BUCKET_NAME,
      Key: filename,
      Body: Buffer.from(imageBuffer),
      ContentType: imageResponse.headers.get("content-type") || undefined,
    };

    // Upload the image to S3
    await s3Client.send(new PutObjectCommand(uploadParams));

    // Generate the S3 URL for the uploaded image
    const s3Url = `https://${process.env.AWS_SAVED_IMAGES_BUCKET_NAME}.s3.amazonaws.com/${filename}`;

    // Save image metadata to the database
    const result = await sql`
      INSERT INTO images (user_id, image_url, s3_url)
      VALUES (${userId}, ${imageUrl}, ${s3Url})
      RETURNING id
    `;

    // Return success response with image details
    return NextResponse.json({
      success: true,
      id: result.rows[0].id,
      s3Url,
      imageCount,
    });
  } catch (error) {
    // Log and return error response
    console.error("Failed to save image:", error);
    return NextResponse.json(
      { error: "Failed to save image" },
      { status: 500 }
    );
  }
}
