import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { sql } from "@vercel/postgres";

export async function GET() {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await sql`
      SELECT u.subscription_tier, COALESCE(uic.image_count, 0) as image_count
      FROM users u
      LEFT JOIN user_image_counts uic ON u.id = uic.user_id
      WHERE u.id = ${userId}
    `;

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { subscription_tier, image_count } = result.rows[0];

    let limit = 0;

    if (subscription_tier === "pro") {
      limit = Number(process.env.NEXT_PUBLIC_PRO_PLAN_IMAGE_GENERATION_LIMIT);
    }

    if (subscription_tier === "basic") {
      limit = Number(process.env.NEXT_PUBLIC_BASIC_PLAN_IMAGE_GENERATION_LIMIT);
    }

    if (subscription_tier === "free") {
      limit = Number(process.env.NEXT_PUBLIC_FREE_PLAN_IMAGE_GENERATION_LIMIT);
    }

    const remainingGenerations = Math.max(0, limit - image_count);

    return NextResponse.json({
      count: image_count,
      remainingGenerations,
      subscription_tier,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST() {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await sql`
      WITH user_data AS (
        SELECT subscription_tier, COALESCE(image_count, 0) as current_count
        FROM users
        LEFT JOIN user_image_counts ON users.id = user_image_counts.user_id
        WHERE users.id = ${userId}
      ),
      updated_count AS (
        INSERT INTO user_image_counts (user_id, image_count)
        VALUES (${userId}, 1)
        ON CONFLICT (user_id)
        DO UPDATE SET image_count = user_image_counts.image_count + 1
        RETURNING image_count
      )
      SELECT user_data.subscription_tier, updated_count.image_count
      FROM user_data, updated_count
    `;

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { subscription_tier, image_count } = result.rows[0];

    let limit = 0;

    if (subscription_tier === "pro") {
      limit = Number(process.env.NEXT_PUBLIC_PRO_PLAN_IMAGE_GENERATION_LIMIT);
    }

    if (subscription_tier === "basic") {
      limit = Number(process.env.NEXT_PUBLIC_BASIC_PLAN_IMAGE_GENERATION_LIMIT);
    }

    if (subscription_tier === "free") {
      limit = Number(process.env.NEXT_PUBLIC_FREE_PLAN_IMAGE_GENERATION_LIMIT);
    }

    if (image_count > limit) {
      return NextResponse.json(
        { error: "Image generation limit reached" },
        { status: 403 }
      );
    }

    const remainingGenerations = Math.max(0, limit - image_count);

    return NextResponse.json({
      count: image_count,
      remainingGenerations,
      subscription_tier,
    });
  } catch (error) {
    console.error("Error updating user image count:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
