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
      SELECT u.subscription_tier, COALESCE(umc.model_count, 0) as model_count
      FROM users u
      LEFT JOIN user_model_counts umc ON u.id = umc.user_id
      WHERE u.id = ${userId}
    `;

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { subscription_tier, model_count } = result.rows[0];

    let limit = 0;

    if (subscription_tier === "premium") {
      limit = Number(process.env.NEXT_PUBLIC_PRO_PLAN_MODEL_CREATION_LIMIT);
    } else if (subscription_tier === "basic") {
      limit = Number(process.env.NEXT_PUBLIC_BASIC_PLAN_MODEL_CREATION_LIMIT);
    } else {
      limit = Number(process.env.NEXT_PUBLIC_FREE_PLAN_MODEL_CREATION_LIMIT);
    }

    const remainingModels = Math.max(0, limit - model_count);

    return NextResponse.json({
      count: model_count,
      remainingModels,
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
        SELECT subscription_tier, COALESCE(model_count, 0) as current_count
        FROM users
        LEFT JOIN user_model_counts ON users.id = user_model_counts.user_id
        WHERE users.id = ${userId}
      ),
      updated_count AS (
        INSERT INTO user_model_counts (user_id, model_count)
        VALUES (${userId}, 1)
        ON CONFLICT (user_id)
        DO UPDATE SET model_count = user_model_counts.model_count + 1
        RETURNING model_count
      )
      SELECT user_data.subscription_tier, updated_count.model_count
      FROM user_data, updated_count
    `;

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { subscription_tier, model_count } = result.rows[0];

    let limit = 0;

    if (subscription_tier === "premium") {
      limit = Number(process.env.NEXT_PUBLIC_PRO_PLAN_MODEL_CREATION_LIMIT);
    } else if (subscription_tier === "basic") {
      limit = Number(process.env.NEXT_PUBLIC_BASIC_PLAN_MODEL_CREATION_LIMIT);
    } else {
      limit = Number(process.env.NEXT_PUBLIC_FREE_PLAN_MODEL_CREATION_LIMIT);
    }

    if (model_count > limit) {
      return NextResponse.json(
        { error: "Model creation limit reached" },
        { status: 403 }
      );
    }

    const remainingModels = Math.max(0, limit - model_count);

    return NextResponse.json({
      count: model_count,
      remainingModels,
      subscription_tier,
    });
  } catch (error) {
    console.error("Error updating user model count:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
