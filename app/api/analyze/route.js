// app/api/analyze/route.js
import { analyzeFood } from "@/app/lib/vision";
import sharp from "sharp";

export const maxDuration = 60;

const processImage = async (buffer) => {
  // Configure Sharp with more options
  const image = sharp(buffer, {
    failOnError: false,
    density: 300,
    limitInputPixels: false,
    pages: 1,
    sequentialRead: true,
  });

  try {
    // Get image metadata
    const metadata = await image.metadata();
    // console.log("Image metadata:", metadata);

    // Convert to JPEG with optimizations
    const processedBuffer = await image
      .jpeg({
        quality: 85,
        chromaSubsampling: "4:4:4",
        force: true, // Force JPEG output
      })
      .resize(1200, 1200, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .rotate() // Auto-rotate based on EXIF
      .toBuffer();

    return processedBuffer.toString("base64");
  } catch (firstError) {
    console.error("First conversion attempt failed:", firstError);

    // Fallback attempt with different settings
    try {
      const fallbackImage = sharp(buffer, {
        failOnError: false,
        limitInputPixels: false,
        sequentialRead: true,
      });

      const fallbackBuffer = await fallbackImage
        .jpeg({
          quality: 85,
          force: true,
        })
        .toBuffer();

      return fallbackBuffer.toString("base64");
    } catch (secondError) {
      console.error("Fallback conversion failed:", secondError);
      throw new Error("Image conversion failed after multiple attempts");
    }
  }
};

export async function POST(req) {
  try {
    console.log("Starting analyze route");
    const formData = await req.formData();
    const imageFile = formData.get("image");

    if (!imageFile) {
      console.log("No image file provided");
      return new Response(JSON.stringify({ error: "No image file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Log file details
    console.log("Processing file:", {
      type: imageFile.type,
      size: imageFile.size,
      name: imageFile.name,
    });

    // Convert to buffer
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log("Buffer created, size:", buffer.length);

    // Process image
    const base64Image = await processImage(buffer);
    console.log("Image processed successfully");

    // Analyze with OpenAI
    const nutritionData = await analyzeFood(base64Image);
    console.log("Analysis completed");

    return new Response(JSON.stringify(nutritionData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API Error:", {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });

    // Determine if it's a processing error or analysis error
    const isProcessingError = error.message.includes("conversion");

    return new Response(
      JSON.stringify({
        error: isProcessingError
          ? "IMAGE_PROCESSING_ERROR"
          : "FOOD_ANALYSIS_ERROR",
        message: error.message,
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
