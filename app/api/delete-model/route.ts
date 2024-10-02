import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { sql } from "@vercel/postgres";
import { getVersionId } from "../../../lib/replicate";

export async function DELETE(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { model_name } = await request.json();

  try {
    // Fetch the model details from the database
    const { rows } = await sql`
      SELECT training_id
      FROM models
      WHERE user_id = ${userId} AND model_name = ${model_name}
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: "Model not found" }, { status: 404 });
    }

    const { training_id } = rows[0];

    const versionId = await getVersionId(training_id);
    let version = versionId.split(":")[1];

    console.log("*******************");
    console.log(model_name);

    // Delete the model
    const modelResponse = await fetch(
      `https://api.replicate.com/v1/models/amoebalabsai/${model_name}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        },
      }
    );

    if (modelResponse.status !== 204) {
      throw new Error("Failed to delete model");
    }

    // Delete the model from the database
    await sql`
      DELETE FROM models
      WHERE user_id = ${userId} AND model_name = ${model_name}
    `;

    return NextResponse.json({ message: "Model deleted successfully" });
  } catch (error) {
    console.error("Error deleting model:", error);
    return NextResponse.json(
      { error: "Failed to delete model" },
      { status: 500 }
    );
  }
}
