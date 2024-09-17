import { sql } from "@vercel/postgres";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  const { userId } = auth();
  const { imageUrl } = await request.json();

  if (!userId || !imageUrl) {
    return NextResponse.json(
      { error: "Missing required data" },
      { status: 400 }
    );
  }

  try {
    // Check and update user's image count
    const countResult = await sql`
      INSERT INTO user_image_counts (user_id, image_count)
      VALUES (${userId}, 1)
      ON CONFLICT (user_id)
      DO UPDATE SET image_count = user_image_counts.image_count + 1
      RETURNING image_count
    `;

    const imageCount = countResult.rows[0].image_count;

    if (imageCount > 5) {
      return NextResponse.json(
        { error: "Image generation limit reached" },
        { status: 403 }
      );
    }

    // Download the image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error("Failed to fetch image");
    }
    const imageBuffer = await imageResponse.arrayBuffer();

    // Generate a unique filename
    const fileExtension = imageUrl.split(".").pop();
    const filename = `${uuidv4()}.${fileExtension}`;

    // Upload to S3
    const uploadParams = {
      Bucket: "photogen-saved-images",
      Key: filename,
      Body: Buffer.from(imageBuffer),
      ContentType: imageResponse.headers.get("content-type") || undefined,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    // Save metadata to database
    const s3Url = `https://photogen-saved-images.s3.amazonaws.com/${filename}`;
    const result = await sql`
      INSERT INTO images (user_id, image_url, s3_url)
      VALUES (${userId}, ${imageUrl}, ${s3Url})
      RETURNING id
    `;

    return NextResponse.json({
      success: true,
      id: result.rows[0].id,
      s3Url,
      imageCount,
    });
  } catch (error) {
    console.error("Failed to save image:", error);
    return NextResponse.json(
      { error: "Failed to save image" },
      { status: 500 }
    );
  }
}
