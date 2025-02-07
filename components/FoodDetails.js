"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";

export default function FoodDetails({ nutritionData, foodImage }) {
  const [mealAnalysis, setMealAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [macros, setMacros] = useState({ carbs: 0, protein: 0, calories: 0 });

  // Memoize formatted nutrition data
  const formattedNutritionData = useMemo(() => {
    if (!nutritionData) return [];
    return nutritionData
      .filter((item) => {
        const [category] = Object.keys(item);
        return category.toLowerCase() !== "summary";
      })
      .map((item) => {
        const [category, value] = Object.entries(item)[0];
        return { category, value: value.toString() };
      });
  }, [nutritionData]);

  // Extract macros in a useEffect
  useEffect(() => {
    if (!nutritionData) return;

    const newMacros = { carbs: 0, protein: 0, calories: 0 };

    nutritionData.forEach((item) => {
      const [category, value] = Object.entries(item)[0];
      const lowerCategory = category.toLowerCase();

      if (lowerCategory.includes("carb")) newMacros.carbs = value;
      if (lowerCategory.includes("protein")) newMacros.protein = value;
      if (lowerCategory.includes("calorie")) newMacros.calories = value;
    });

    setMacros(newMacros);
  }, [nutritionData]);

  // Fetch meal analysis
  useEffect(() => {
    const fetchMealAnalysis = async () => {
      const summaryItem = nutritionData.find(
        (item) => Object.keys(item)[0].toLowerCase() === "summary"
      );

      if (summaryItem) {
        setIsLoading(true);
        try {
          const response = await fetch("/api/meal", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              summary: Object.values(summaryItem)[0],
            }),
          });

          const data = await response.json();

          if (!response.ok || data.error) {
            toast.error("Failed to analyze meal", {
              duration: 4000,
              style: {
                border: "1px solid #EF4444", // Error red border
                padding: "16px",
                color: "#EF4444", // Error red text
                backgroundColor: "#FEF2F2", // Light red background
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: "500",
              },
              iconTheme: {
                primary: "#EF4444", // Error red icon
                secondary: "#FFFFFF", // White background for icon
              },
            });
            return;
          }

          setMealAnalysis(Array.isArray(data) ? data : []);
        } catch (error) {
          // Only show toast for unexpected network/parsing errors
          toast.error("Failed to analyze meal", {
            duration: 3000,
            style: {
              border: "1px solid #ff4b4b",
              padding: "16px",
              color: "#ff4b4b",
            },
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (nutritionData) {
      fetchMealAnalysis();
    }
  }, [nutritionData]);

  if (formattedNutritionData.length === 0) {
    return null;
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Nutrition Facts Table */}
        <motion.div
          className="bg-gray-50/95 dark:bg-gray-800/95 rounded-2xl shadow-2xl backdrop-blur-sm w-full lg:w-3/5"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6">
            <motion.h2
              className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
            >
              Nutrition Facts
            </motion.h2>

            <div className="flex flex-col space-y-2">
              {formattedNutritionData.map((item, index) => (
                <motion.div
                  key={item.category}
                  className="flex items-start justify-between py-3 px-4 
                         hover:bg-gray-100/80 dark:hover:bg-gray-700/30 
                         rounded-lg transition-all"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-base sm:text-lg font-bold text-gray-500 dark:text-gray-400 uppercase">
                    {item.category}
                  </div>

                  <div className="pl-6 text-right">
                    <span className="text-sm sm:text-lg font-semibold text-gray-800 dark:text-gray-200">
                      {item.value}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Column */}
        <div className="w-full lg:w-2/5 flex flex-col gap-6">
          {/* Single Card Container for Overview and Analysis */}
          <motion.div
            className="bg-gray-50/95 dark:bg-gray-800/95 rounded-2xl shadow-2xl p-6"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Meal Analysis
            </h3>

            {foodImage && (
              <motion.div
                className="relative w-full h-48 sm:h-56 rounded-xl overflow-hidden mb-6"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Image
                  src={foodImage}
                  alt="Analyzed meal"
                  layout="fill"
                  objectFit="contain"
                  className="rounded-xl bg-gray-100 dark:bg-gray-700/50"
                />
              </motion.div>
            )}

            {/* Macros Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: "Carbs", value: macros.carbs, icon: "🍞" },
                { label: "Protein", value: macros.protein, icon: "💪" },
                { label: "Calories", value: macros.calories, icon: "🔥" },
              ].map((macro) => (
                <motion.div
                  key={macro.label}
                  className="p-2.5 sm:p-4 rounded-xl bg-white dark:bg-gray-700/50 
                         border border-gray-100 dark:border-gray-600"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-lg sm:text-2xl mb-1 grayscale">
                    {macro.icon}
                  </div>
                  <div className="text-[11px] sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    {macro.label}
                  </div>
                  <div className="text-xs sm:text-lg font-bold text-gray-800 dark:text-gray-200">
                    {macro.value}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Analysis Points */}
            {mealAnalysis && (
              <div className="space-y-3">
                {mealAnalysis.map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-2 bg-white dark:bg-gray-700/50 rounded-lg
                           text-gray-700 dark:text-gray-300 text-sm sm:text-lg font-medium"
                  >
                    {point}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
