// utils/healthCalculations.js

/**
 * Calculates BMI (Body Mass Index)
 * Formula: weight (kg) / (height (m))²
 * @param {number} weight - Weight in kilograms
 * @param {number} heightCm - Height in centimeters
 * @returns {number} BMI value rounded to 1 decimal place
 */
export const calculateBMI = (weight, heightCm) => {
  const heightM = heightCm / 100;
  const bmi = weight / (heightM * heightM);
  return parseFloat(bmi.toFixed(1));
};

/**
 * Calculates daily calorie intake (TDEE - Total Daily Energy Expenditure)
 * Adjusts based on BMI to achieve a normal weight range.
 * @param {number} weight - Weight in kilograms
 * @param {number} heightCm - Height in centimeters
 * @param {string} gender - 'male' or 'female'
 * @param {string} activityLevel - Activity level category
 * @param {number} age - Age in years
 * @returns {number} Daily calorie intake rounded to nearest whole number
 */
export const calculateCaloriesIntake = (
  weight,
  heightCm,
  gender,
  activityLevel,
  age
) => {
  // const bmi = calculateBMI(weight, heightCm);
  const targetWeight = Math.round(22.5 * (heightCm / 100) ** 2);

  // Step 2: Determine the goal
  let goal;
  if (weight > targetWeight) {
    goal = "weight_loss";
  } else if (weight < targetWeight) {
    goal = "weight_gain";
  } else {
    goal = "maintenance";
  }

  // Step 3: Calculate BMR using Mifflin-St Jeor Equation
  let bmr;
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * heightCm - 5 * age - 161;
  }

  // Step 4: Adjust for activity level
  const activityMultipliers = {
    mostly_inactive: 1.2,
    somewhat_active: 1.375,
    active: 1.55,
    very_active: 1.725,
  };
  const tdee = bmr * activityMultipliers[activityLevel];

  // Step 5: Adjust calorie target based on goal
  let calorieTarget;
  if (goal === "weight_loss") {
    calorieTarget = tdee - 300; // Moderate deficit
  } else if (goal === "weight_gain") {
    calorieTarget = tdee + 300; // Moderate surplus
  } else {
    calorieTarget = tdee; // Maintenance
  }
  return Math.round(calorieTarget);
};
