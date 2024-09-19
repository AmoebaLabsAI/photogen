import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll('images') as File[];

    // Here, implement your file saving logic
    // This could involve saving to a cloud storage service like S3
    // For now, we'll just log the file names
    const savedFiles = files.map(file => file.name);

    return NextResponse.json({ success: true, savedFiles });
  } catch (error: any) {
    console.error("Error saving images:", error);
    return NextResponse.json({ message: error.message || "Server error" }, { status: 500 });
  }
}
