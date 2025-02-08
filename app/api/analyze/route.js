import { analyzeFood } from "@/app/lib/vision";
import sharp from "sharp";

export const maxDuration = 60; // Set maximum duration to 60 seconds

const convertToPngBase64 = async (buffer) => {
  try {
    const pngBuffer = await sharp(buffer).png({ quality: 80 }).toBuffer();
    return pngBuffer.toString("base64");
  } catch (error) {
    console.error("Error converting image:", error);
    throw error;
  }
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image");

    if (!imageFile) {
      return new Response(JSON.stringify({ error: "No image file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Convert the file to buffer
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert to PNG base64
    const pngBase64 = await convertToPngBase64(buffer);

    // Analyze the image using OpenAI
    const nutritionData = await analyzeFood(pngBase64);

    return new Response(JSON.stringify(nutritionData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to analyze image" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
