import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const sessionId = uuidv4();

    await sql`
      INSERT INTO pre_sessions (id, user_id, created_at)
      VALUES (${sessionId}, ${userId}, NOW())
    `;

    return NextResponse.json({ sessionId });
  } catch (err: any) {
    console.error("Error creating pre-session:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
