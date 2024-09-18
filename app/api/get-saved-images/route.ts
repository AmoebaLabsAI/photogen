import { sql } from "@vercel/postgres";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  // Get the authenticated user's ID using Clerk
  const { userId } = auth();

  // If no user is authenticated, return an unauthorized error
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Query the database to fetch all images for the authenticated user
    const result = await sql`
      SELECT * FROM images
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    // Return the fetched images as a JSON response
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    // Log the error and return a 500 status code if there's an issue
    console.error("Failed to fetch images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
