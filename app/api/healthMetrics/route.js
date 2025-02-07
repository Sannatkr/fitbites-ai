// app/api/healthMetrics/route.js
import { NextResponse } from "next/server";
import { dbConnect, User, HealthMetric } from "@/app/lib/mongodb";
import jwt from "jsonwebtoken";
import {
  calculateBMI,
  calculateCaloriesIntake,
} from "@/utils/metricCalculations";
import { calculateMacros } from "@/utils/macros";

const JWT_SECRET = process.env.NEXT_APP_JWT_SECRET;

export async function POST(request) {
  if (!JWT_SECRET) {
    console.error("JWT_SECRET is not defined");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  try {
    const {
      name,
      gender,
      age,
      weight,
      heightFt,
      heightIn,
      activityLevel,
      phoneNumber,
    } = await request.json();

    await dbConnect();

    // Convert height to centimeters and format display height
    const heightCm = parseFloat(heightFt) * 30.48 + parseFloat(heightIn) * 2.54;
    const height = `${heightFt}'${heightIn}"`;

    // Calculate BMI and calories intake
    const bmi = calculateBMI(weight, heightCm);
    const caloriesIntake = calculateCaloriesIntake(
      weight,
      heightCm,
      gender,
      activityLevel,
      age
    );

    // Calculate target weight and macros
    const targetWeight = Math.round(22.5 * (heightCm / 100) ** 2);
    const macros = calculateMacros(caloriesIntake, weight, age, activityLevel);

    // Convert macros to string for storage
    const macrosString = JSON.stringify({
      protein: `${macros.protein}g`,
      carbs: `${macros.carbs}g`,
      fat: `${macros.fat}g`,
      percentages: macros.percentages,
    });

    // Create new user
    const user = await User.create({
      phoneNumber,
      name,
    });

    // Create health metrics with new fields
    const healthMetric = await HealthMetric.create({
      userId: user._id,
      name,
      gender,
      age,
      weight,
      height,
      heightCm,
      activityLevel,
      bmi,
      caloriesIntake,
      targetWeight,
      macros: macrosString,
    });

    // Generate token with the new userId
    const token = jwt.sign({ phoneNumber, userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return NextResponse.json({
      success: true,
      token,
      userId: user._id,
      metrics: {
        id: healthMetric._id,
        bmi,
        caloriesIntake,
        targetWeight,
        macros: JSON.parse(macrosString),
      },
    });
  } catch (error) {
    console.error("Health metrics error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Phone number already registered" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
