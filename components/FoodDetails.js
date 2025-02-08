"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";

export default function FoodDetails({ nutritionData, foodImage }) {
  const [mealAnalysis, setMealAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [macros, setMacros] = useState({
    carbs: "0g",
    protein: "0g",
    calories: "0 kcal",
    fats: {
      saturated: "0g",
      unsaturated: "0g",
      trans: "0g",
    },
    fiber: "0g",
    sugar: "0g",
  });

  const [vitamins, setVitamins] = useState({
    A: "0mcg",
    C: "0mg",
    D: "0mcg",
    E: "0mg",
  });

  const [minerals, setMinerals] = useState({
    calcium: "0mg",
    phosphorus: "0mg",
    iron: "0mg",
    zinc: "0mcg",
    magnesium: "0mg",
    sodium: "0mg",
  });

  const [dietCompatibility, setDietCompatibility] = useState("");

  // Extract all nutrition data
  useEffect(() => {
    if (!nutritionData) return;

    try {
      nutritionData.forEach((item) => {
        const [category, value] = Object.entries(item)[0];
        const lowerCategory = category.toLowerCase();

        if (lowerCategory.includes("carb")) {
          setMacros((prev) => ({ ...prev, carbs: value }));
        } else if (lowerCategory.includes("protein")) {
          setMacros((prev) => ({ ...prev, protein: value }));
        } else if (lowerCategory.includes("calorie")) {
          setMacros((prev) => ({ ...prev, calories: value }));
        } else if (lowerCategory.includes("fat")) {
          setMacros((prev) => ({ ...prev, fats: extractFats(value) }));
        } else if (lowerCategory.includes("fiber")) {
          setMacros((prev) => ({ ...prev, fiber: value }));
        } else if (lowerCategory.includes("sugar")) {
          setMacros((prev) => ({ ...prev, sugar: value }));
        } else if (lowerCategory.includes("vitamin")) {
          setVitamins(extractVitamins(value));
        } else if (lowerCategory.includes("mineral")) {
          setMinerals(extractMinerals(value));
        } else if (lowerCategory.includes("diet")) {
          setDietCompatibility(value);
        }
      });
    } catch (error) {
      console.error("Error processing nutrition data:", error);
    }
  }, [nutritionData]);

  // Helper functions to extract values
  const extractFats = (fatString) => {
    const fats = {
      saturated: "0g",
      unsaturated: "0g",
      trans: "0g",
    };

    try {
      const fatParts = fatString.split(",").map((part) => part.trim());
      fatParts.forEach((part) => {
        if (part.toLowerCase().includes("saturated")) {
          fats.saturated = part.split(":")[1]?.trim() || part;
        } else if (part.toLowerCase().includes("unsaturated")) {
          fats.unsaturated = part.split(":")[1]?.trim() || part;
        } else if (part.toLowerCase().includes("trans")) {
          fats.trans = part.split(":")[1]?.trim() || part;
        }
      });
    } catch (error) {
      console.error("Error parsing fats:", error);
    }

    return fats;
  };

  const extractVitamins = (vitaminString) => {
    const vitamins = {
      A: "0mcg",
      C: "0mg",
      D: "0mcg",
      E: "0mg",
    };

    try {
      const vitaminParts = vitaminString.split(",").map((part) => part.trim());
      vitaminParts.forEach((part) => {
        const [vitamin, value] = part.split(":");
        if (vitamin && value) {
          const key = vitamin.trim().charAt(0);
          if (vitamins.hasOwnProperty(key)) {
            vitamins[key] = value.trim();
          }
        }
      });
    } catch (error) {
      console.error("Error parsing vitamins:", error);
    }

    return vitamins;
  };

  const extractMinerals = (mineralString) => {
    const minerals = {
      calcium: "0mg",
      phosphorus: "0mg",
      iron: "0mg",
      zinc: "0mcg",
      magnesium: "0mg",
      sodium: "0mg",
    };

    try {
      const mineralParts = mineralString.split(",").map((part) => part.trim());
      mineralParts.forEach((part) => {
        const [mineral, value] = part.split(":");
        if (mineral && value) {
          const key = mineral.trim().toLowerCase();
          if (minerals.hasOwnProperty(key)) {
            minerals[key] = value.trim();
          }
        }
      });
    } catch (error) {
      console.error("Error parsing minerals:", error);
    }

    return minerals;
  };

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
            toast.error("Failed to analyze meal");
            return;
          }

          setMealAnalysis(Array.isArray(data) ? data : []);
        } catch (error) {
          toast.error("Failed to analyze meal");
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (nutritionData) {
      fetchMealAnalysis();
    }
  }, [nutritionData]);

  if (!nutritionData) return null;

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Left Column - Meal Analysis */}
        <div className="w-full lg:w-2/5 flex flex-col gap-6">
          <motion.div
            className="bg-gray-50/95 dark:bg-gray-800/95 rounded-2xl shadow-2xl p-6"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl sm:text-2xl font-bold text-blue-700 dark:text-blue-600 mb-6">
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
                  <div className="text-lg sm:text-2xl mb-1 opacity-75 grayscale brightness-90">
                    {macro.icon}
                  </div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {macro.label}
                  </div>
                  <div className="text-sm sm:text-lg font-bold text-gray-800 dark:text-gray-200">
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
                    className="p-3 bg-white dark:bg-gray-700/50 rounded-lg
                           text-gray-700 dark:text-gray-300 text-xs sm:text-lg font-medium"
                  >
                    {point}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column - Nutrition Facts */}
        <motion.div
          className="w-full lg:w-3/5"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gray-50/95 dark:bg-gray-800/95 rounded-2xl shadow-2xl backdrop-blur-sm p-6">
            <motion.h2
              className="text-lg sm:text-2xl font-bold text-blue-700 dark:text-blue-600 mb-6 text-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
            >
              Nutrition Facts
            </motion.h2>

            <div className="space-y-2">
              {/* Main Macros */}
              <motion.div className="space-y-2">
                {[
                  { label: "Calories", value: macros.calories },
                  { label: "Protein", value: macros.protein },
                  { label: "Carbohydrates", value: macros.carbs },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    className="bg-white dark:bg-gray-700/50 rounded-xl p-4 hover:bg-gray-50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="text-sm sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {item.label}
                      </div>
                      <div className="text-sm sm:text-xl font-medium text-gray-700 dark:text-gray-300">
                        {item.value}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Fats */}

              {/* Other Macros */}
              <div className="space-y-2">
                {[
                  { label: "Fiber", value: macros.fiber },
                  { label: "Sugar", value: macros.sugar },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    className="bg-white dark:bg-gray-700/50 rounded-xl p-4 hover:bg-gray-50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="text-sm sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {item.label}
                      </div>
                      <div className="text-sm sm:text-xl font-medium text-gray-700 dark:text-gray-300">
                        {item.value}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-2">
                <h3 className="text-lg sm:text-2xl font-semibold text-blue-700 dark:text-blue-600">
                  Fats
                </h3>
                {Object.entries(macros.fats).map(([key, value], index) => (
                  <motion.div
                    key={key}
                    className="bg-white dark:bg-gray-700/50 rounded-xl p-4 hover:bg-gray-50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="text-sm sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </div>
                      <div className="text-sm sm:text-xl font-medium text-gray-700 dark:text-gray-300">
                        {value}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Vitamins */}
              <div className="space-y-2">
                <h3 className="text-lg sm:text-2xl font-semibold text-blue-700 dark:text-blue-600">
                  Vitamins
                </h3>
                {Object.entries(vitamins).map(([key, value], index) => (
                  <motion.div
                    key={key}
                    className="bg-white dark:bg-gray-700/50 rounded-xl p-4 hover:bg-gray-50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="text-sm sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                        Vitamin {key}
                      </div>
                      <div className="text-sm sm:text-xl font-medium text-gray-700 dark:text-gray-300">
                        {value}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Minerals */}
              <div className="space-y-2">
                <h3 className="text-lg sm:text-2xl font-semibold text-blue-700 dark:text-blue-600">
                  Minerals
                </h3>
                {Object.entries(minerals).map(([key, value], index) => (
                  <motion.div
                    key={key}
                    className="bg-white dark:bg-gray-700/50 rounded-xl p-4 hover:bg-gray-50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="text-sm sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </div>
                      <div className="text-sm sm:text-xl font-medium text-gray-700 dark:text-gray-300">
                        {value}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Diet Compatibility */}
              {dietCompatibility && (
                <motion.div
                  className="bg-white dark:bg-gray-700/50 rounded-xl py-4 px-2 hover:bg-gray-50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex justify-between gap-4 items-center">
                    <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      Dietary Profile
                    </div>
                    <div className="text-sm sm:text-xl font-medium text-gray-700 dark:text-gray-300">
                      {dietCompatibility}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
