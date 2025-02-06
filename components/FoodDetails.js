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
              duration: 3000,
              style: {
                border: "1px solid #ff4b4b",
                padding: "16px",
                color: "#ff4b4b",
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
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 pt-10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-x-8 items-start">
        {/* Table Container */}
        <motion.div
          className="bg-white/80 dark:bg-gray-800/90 rounded-2xl shadow-xl backdrop-blur-sm overflow-hidden flex-grow md:w-3/5"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h2
            className="text-4xl font-bold text-blue-600 dark:text-blue-300 my-8 text-center"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            Nutrition Facts
          </motion.h2>
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-400 to-purple-400 dark:from-gray-500 dark:to-gray-700 dark:text-white text-black">
                <th className="px-8 py-4 text-left text-2xl font-extrabold tracking-wider">
                  Nutrient
                </th>
                <th className="px-8 py-4 text-left text-2xl font-bold tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {formattedNutritionData.map((item, index) => (
                <motion.tr
                  key={item.category}
                  className={`group hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer transition-transform ${
                    item.value.length > 15 ? "min-h-[80px]" : "min-h-[60px]"
                  }`}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <td className="px-8 py-5 text-lg font-bold text-blue-800 dark:text-blue-100 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-300">
                    {item.category.toUpperCase()}
                  </td>
                  <td
                    className="px-8 py-5 text-lg font-semibold text-black dark:text-white transition-colors group-hover:text-blue-500 dark:group-hover:text-blue-200"
                    style={{
                      color: `hsl(${(index * 40) % 360}, 70%, 50%)`,
                    }}
                  >
                    {item.value}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Right Column */}
        <motion.div
          className="w-full md:w-2/5 bg-white/80 dark:bg-gray-800/90 rounded-2xl shadow-xl backdrop-blur-sm p-6 space-y-6"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-300">
            Meal Overview
          </h3>

          {foodImage && (
            <motion.div
              className="relative w-full h-64 rounded-xl overflow-hidden shadow-lg"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Image
                src={foodImage}
                alt="Analyzed meal"
                layout="fill"
                objectFit="contain"
                className="rounded-xl bg-gray-50 dark:bg-gray-700 p-2"
              />
            </motion.div>
          )}

          {/* Macros Grid */}
          <div className="grid grid-cols-3 gap-4">
            <motion.div
              className="p-4 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600"
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-4xl mb-2 grayscale dark:brightness-150">
                🍞
              </div>
              <div className="font-bold text-black dark:text-gray-200 font-mono">
                Carbs
              </div>
              <div className="text-xl font-black text-gray-800 dark:text-gray-100">
                {macros.carbs}
              </div>
            </motion.div>

            <motion.div
              className="p-4 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600"
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-4xl mb-2 grayscale dark:brightness-150">
                💪
              </div>
              <div className="font-bold text-black dark:text-gray-200 font-mono">
                Protein
              </div>
              <div className="text-xl font-black text-gray-800 dark:text-gray-100">
                {macros.protein}
              </div>
            </motion.div>

            <motion.div
              className="p-4 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600"
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-4xl mb-2 grayscale dark:brightness-150">
                🔥
              </div>
              <div className="font-bold text-black dark:text-gray-200 font-mono">
                Calories
              </div>
              <div className="text-xl font-black text-gray-800 dark:text-gray-100">
                {macros.calories}
              </div>
            </motion.div>
          </div>

          {/* Analysis Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-300">
              Nutritional Analysis
            </h3>

            {isLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"
                  ></div>
                ))}
              </div>
            ) : mealAnalysis ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                {mealAnalysis.map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-700 dark:text-gray-300"
                  >
                    {point}
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No analysis available
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
