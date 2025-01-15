"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function FoodDetails({ nutritionData, foodImage }) {
  const [mealAnalysis, setMealAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const formatNutritionData = (data) => {
    if (!data) return [];
    return data
      .filter((item) => {
        const [category] = Object.keys(item);
        return category.toLowerCase() !== "summary";
      })
      .map((item) => {
        const [category, value] = Object.entries(item)[0];
        return { category, value: value.toString() };
      });
  };

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

          if (!response.ok) throw new Error("Analysis failed");
          const data = await response.json();
          if (data && Array.isArray(data)) {
            setMealAnalysis(data);
          } else {
            console.error("Invalid meal analysis response:", data);
          }
        } catch (error) {
          console.error("Error analyzing meal:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (nutritionData) {
      fetchMealAnalysis();
    }
  }, [nutritionData]);

  useEffect(() => {
    console.log("Meal Analysis:", mealAnalysis); // Debugging log
  }, [mealAnalysis]);

  const formattedNutritionData = formatNutritionData(nutritionData);

  if (formattedNutritionData.length === 0) {
    return null;
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 mt-10">
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
                  transition={{ delay: index * 0.01 }}
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

        {/* Meal Analysis Div */}
        <motion.div
          className="w-full md:w-2/5 bg-white/80 dark:bg-gray-800/90 rounded-2xl shadow-xl backdrop-blur-sm p-6 space-y-6"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-300">
            Meal Analysis
          </h3>

          {foodImage && (
            <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-lg mb-6">
              <Image
                src={foodImage}
                alt="Analyzed meal"
                layout="fill"
                objectFit="cover"
                className="rounded-xl"
              />
            </div>
          )}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {isLoading ? (
              <div className="space-y-6 mt-4">
                {/* Loading Skeleton */}
                <div className="space-y-3">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6"></div>
                </div>
              </div>
            ) : mealAnalysis &&
              Array.isArray(mealAnalysis) &&
              mealAnalysis.length > 0 ? (
              <div className="space-y-4">
                {mealAnalysis.map((point, index) => (
                  <p
                    key={index}
                    className="text-gray-700 dark:text-gray-300 text-xl font-normal"
                  >
                    {point}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 font-normal dark:text-gray-400 text-xl">
                No analysis available.
              </p>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
