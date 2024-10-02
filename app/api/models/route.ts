import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { sql } from "@vercel/postgres";

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { rows } = await sql`
      SELECT id, model_name, trigger_word, training_id, created_at
      FROM models
      WHERE user_id = ${userId}
    `;

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching models:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
