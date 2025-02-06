export const calculateMacros = (
  dailyCalories,
  bodyWeight,
  age,
  activityLevel
) => {
  // Updated protein multipliers for older adults
  const proteinMultiplier = {
    under_30: {
      mostly_inactive: 0.8,
      somewhat_active: 1.2,
      active: 1.6,
      very_active: 2.0,
    },
    age_30_to_50: {
      mostly_inactive: 0.8,
      somewhat_active: 1.1,
      active: 1.4,
      very_active: 1.8,
    },
    over_50: {
      mostly_inactive: 1.0,
      somewhat_active: 1.3,
      active: 1.6,
      very_active: 1.8,
    },
  };

  // Step 1: Protein Calculation
  const ageGroup =
    age < 30 ? "under_30" : age < 51 ? "age_30_to_50" : "over_50";
  const proteinGrams = Math.round(
    proteinMultiplier[ageGroup][activityLevel] * bodyWeight
  );
  const proteinCalories = proteinGrams * 4;

  // Step 2: Calculate remaining calories after protein
  const remainingCalories = dailyCalories - proteinCalories;

  // Step 3: Fat/Carb ratios based on remaining calories
  const fatRatio = age > 50 ? 0.25 : 0.3; // 25% or 30% of remaining
  const carbRatio = 1 - fatRatio;

  // Calculate fat and carbs
  const fatCalories = Math.round(remainingCalories * fatRatio);
  const fatGrams = Math.round(fatCalories / 9);

  const carbCalories = Math.round(remainingCalories * carbRatio);
  const carbGrams = Math.round(carbCalories / 4);

  // Calculate percentages (no adjustment needed)
  const proteinPercentage = Math.round((proteinCalories / dailyCalories) * 100);
  const fatPercentage = Math.round((fatCalories / dailyCalories) * 100);
  const carbPercentage = 100 - proteinPercentage - fatPercentage;

  return {
    protein: `${proteinGrams}`,
    carbs: `${carbGrams}`,
    fat: `${fatGrams}`,
    percentages: {
      protein: proteinPercentage,
      carbs: carbPercentage,
      fat: fatPercentage,
    },
  };
};
