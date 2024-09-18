import { sql } from "@vercel/postgres";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  // Get the user ID from the Clerk authentication
  const { userId } = auth();

  // Check if the user is authenticated
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Query the database to get the image count for the user
    const result = await sql`
      SELECT image_count FROM user_image_counts
      WHERE user_id = ${userId}
    `;

    // Extract the image count from the query result
    // If no record is found, default to 0
    const imageCount = result.rows.length > 0 ? result.rows[0].image_count : 0;

    // Return the image count as a JSON response
    return NextResponse.json({ imageCount });
  } catch (error) {
    // Log the error and return a 500 status code if there's an exception
    console.error("Failed to get image count:", error);
    return NextResponse.json(
      { error: "Failed to get image count" },
      { status: 500 }
    );
  }
}
