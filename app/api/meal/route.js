// app/api/meal/route.js
import { analyzeMealSummary } from "@/app/lib/vision";

export async function POST(req) {
  try {
    const body = await req.json();
    const { summary } = body;

    if (!summary) {
      return new Response(
        JSON.stringify({
          error: "No meal summary provided",
          code: "MEAL_ANALYSIS_ERROR",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const analysis = await analyzeMealSummary(summary);

    console.log("Analysis are: ", analysis);

    return new Response(JSON.stringify(analysis), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to analyze meal",
        code: error.code || "MEAL_ANALYSIS_ERROR",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
