// app/api/getUserMetrics/route.js
import { NextResponse } from "next/server";
import { dbConnect, HealthMetric } from "@/app/lib/mongodb";
import { verify } from "jsonwebtoken";

export async function GET(request) {
  try {
    await dbConnect();

    // Get token from cookieco
    // console.log(request);
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // console.log("Token is: ", token);
    // Verify token and get userId
    const decoded = verify(token, process.env.NEXT_APP_JWT_SECRET);
    const userId = decoded.userId;
    // console.log("name: ", userId);

    // Get user metrics
    const metrics = await HealthMetric.findOne({ userId });
    if (!metrics) {
      return NextResponse.json({ error: "Metrics not found" }, { status: 404 });
    }

    // console.log("metrics are: ", metrics);

    return NextResponse.json({
      success: true,
      metrics: {
        username: metrics.name,
        weight: metrics.weight,
        height: metrics.height,
        age: metrics.age,
        bmi: parseFloat(metrics.bmi),
        dailyCalories: metrics.caloriesIntake,
        gender: metrics.gender,
        targetWeight: metrics.targetWeight,
        macros: metrics.macros,
        activityLevel: metrics.activityLevel,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
