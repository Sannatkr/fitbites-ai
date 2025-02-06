// utils/updateDetailsHandler.js
import { calculateBMI, calculateCaloriesIntake } from "./metricCalculations";
import { calculateMacros } from "./macros";

export const updateDetailsHandler = async (formData, userId) => {
  try {
    // Parse height into components
    const [heightFt, heightIn] = formData.height.split("'");
    const heightInches = parseInt(heightIn);
    const heightCm = parseFloat(heightFt) * 30.48 + heightInches * 2.54;

    // Calculate new metrics
    const bmi = calculateBMI(formData.weight, heightCm);
    const caloriesIntake = calculateCaloriesIntake(
      formData.weight,
      heightCm,
      formData.gender,
      formData.activityLevel,
      formData.age
    );

    const targetWeight = Math.round(22.5 * (heightCm / 100) ** 2);
    const macros = calculateMacros(
      caloriesIntake,
      formData.weight,
      formData.age,
      formData.activityLevel
    );

    // Convert macros to string for storage
    const macrosString = JSON.stringify({
      protein: `${macros.protein}g`,
      carbs: `${macros.carbs}g`,
      fat: `${macros.fat}g`,
      percentages: macros.percentages,
    });

    // Prepare update payload
    const updatePayload = {
      weight: formData.weight,
      height: formData.height,
      heightCm,
      age: formData.age,
      activityLevel: formData.activityLevel,
      bmi,
      caloriesIntake,
      targetWeight,
      macros: macrosString,
    };

    return {
      success: true,
      updatePayload,
      calculatedMetrics: {
        bmi,
        caloriesIntake,
        targetWeight,
        macros: JSON.parse(macrosString),
      },
    };
  } catch (error) {
    console.error("Error in updateDetailsHandler:", error);
    throw new Error("Failed to process metrics update");
  }
};
