// app/api/healthMetrics/update/route.js
import { NextResponse } from "next/server";
import { dbConnect, HealthMetric } from "@/app/lib/mongodb";
import { updateDetailsHandler } from "@/utils/updateDetailsHandler";
import { verify } from "jsonwebtoken";

export async function PUT(request) {
  try {
    // Get token from cookies
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token and get userId
    const decoded = verify(token, process.env.NEXT_APP_JWT_SECRET);
    const userId = decoded.userId;

    // Get form data and connect to DB
    const formData = await request.json();
    await dbConnect();

    // Process the update using the handler
    const { success, updatePayload, calculatedMetrics } =
      await updateDetailsHandler(formData, userId); // Use userId from token

    if (!success) {
      throw new Error("Failed to process update");
    }

    console.log("Form Data is: ", formData);

    // Update health metrics using userId from token
    const updatedMetrics = await HealthMetric.findOneAndUpdate(
      { userId }, // Use userId from token instead of formData
      updatePayload,
      { new: true }
    );

    console.log("Updated Metrics is: ", updatedMetrics);

    if (!updatedMetrics) {
      return NextResponse.json(
        { error: "Health metrics not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      metrics: {
        ...updatedMetrics.toObject(),
        macros: calculatedMetrics.macros,
      },
    });
  } catch (error) {
    console.error("Update health metrics error:", error);
    // Check if error is due to invalid token
    if (error.name === "JsonWebTokenError") {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
