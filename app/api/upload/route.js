// app/api/upload/route.js
import { NextResponse } from "next/server";
import { uploadToS3 } from "@/app/lib/s3";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");
    // console.log("file: ", file);

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileName = `${Date.now()}-${file.name}`;
    const imageUrl = await uploadToS3(file, fileName);

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.log("error is: ", error.message);
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
}
