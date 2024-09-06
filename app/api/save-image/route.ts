import { sql } from "@vercel/postgres";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

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
    const result = await sql`
      INSERT INTO images (user_id, image_url)
      VALUES (${userId}, ${imageUrl})
      RETURNING id
    `;
    return NextResponse.json({ success: true, id: result.rows[0].id });
  } catch (error) {
    console.error("Failed to save image:", error);
    return NextResponse.json(
      { error: "Failed to save image" },
      { status: 500 }
    );
  }
}
