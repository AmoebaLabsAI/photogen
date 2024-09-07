import { sql } from "@vercel/postgres";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await sql`
      SELECT image_count FROM user_image_counts
      WHERE user_id = ${userId}
    `;

    const imageCount = result.rows.length > 0 ? result.rows[0].image_count : 0;

    return NextResponse.json({ imageCount });
  } catch (error) {
    console.error("Failed to get image count:", error);
    return NextResponse.json(
      { error: "Failed to get image count" },
      { status: 500 }
    );
  }
}
