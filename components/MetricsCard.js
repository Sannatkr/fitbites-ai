import React from "react";
import { PieChart, Pie, Cell } from "recharts";

const getBmiColor = (bmi) => {
  if (bmi < 18.5) return "from-yellow-400 via-yellow-500 to-green-400";
  if (bmi <= 24.9) return "from-green-400 via-green-500 to-green-600";
  return "from-green-400 via-yellow-500 to-red-500";
};

const MetricsCard = ({
  username = "Sarah",
  weight = 70,
  height = "5'8\"",
  bmi = 22.4,
  dailyCalories = 2000,
  macros = {
    protein: 150,
    carbs: 225,
    fats: 55,
    percentages: {
      proteinPercentage: 30,
      carbsPercentage: 45,
      fatsPercentage: 25,
    },
  },
}) => {
  const data = [
    {
      name: "Proteins",
      value: macros.percentages.proteinPercentage,
      color: "#3B82F6",
      grams: macros.protein,
    },
    {
      name: "Carbs",
      value: macros.percentages.carbsPercentage,
      color: "#10B981",
      grams: macros.carbs,
    },
    {
      name: "Fats",
      value: macros.percentages.fatsPercentage,
      color: "#F59E0B",
      grams: macros.fats,
    },
  ];

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-purple-300 dark:from-blue-900 to dark:to-purple-900 transform rotate-1 rounded-3xl blur-md"></div>
      <div className="relative p-8 bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl shadow-2xl">
        <div className="text-center mb-6">
          <h2
            className="text-2xl font-bold text-blue-600 dark:text-blue-400"
            style={{ fontFamily: "Comic Sans MS, cursive" }}
          >
            {username}'s Health Metrics ✨
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-baseline space-x-2">
                <span
                  className="text-4xl font-bold text-blue-600 dark:text-white"
                  style={{ fontFamily: "Comic Sans MS, cursive" }}
                >
                  {weight}
                </span>
                <span
                  className="text-2xl text-blue-500 dark:text-blue-300"
                  style={{ fontFamily: "Comic Sans MS, cursive" }}
                >
                  kg
                </span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span
                  className="text-4xl font-bold text-blue-600 dark:text-white"
                  style={{ fontFamily: "Comic Sans MS, cursive" }}
                >
                  {height}
                </span>
                <span
                  className="text-2xl text-blue-500 dark:text-blue-300"
                  style={{ fontFamily: "Comic Sans MS, cursive" }}
                >
                  in
                </span>
              </div>
            </div>

            <div className="p-4 bg-blue-100 rounded-xl">
              <span
                className="text-lg font-bold text-blue-600 dark:text-black"
                style={{ fontFamily: "Comic Sans MS, cursive" }}
              >
                Daily Calories: {dailyCalories} kcal
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span
                  className="text-lg font-medium text-blue-600 dark:text-blue-400"
                  style={{ fontFamily: "Comic Sans MS, cursive" }}
                >
                  BMI Health Meter
                </span>
                <span
                  className="text-lg font-bold text-blue-600 dark:text-white"
                  style={{ fontFamily: "Comic Sans MS, cursive" }}
                >
                  {bmi}
                </span>
              </div>
              <div className="h-8 bg-gray-200 rounded-full overflow-hidden relative shadow-inner">
                <div
                  className={`h-full bg-gradient-to-r ${getBmiColor(
                    bmi
                  )} transition-all duration-1000 ease-in-out relative shadow-lg`}
                  style={{ width: `${(bmi / 40) * 100}%` }}
                >
                  <div className="absolute inset-0 animate-pulse opacity-50"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center relative">
            <div className="relative">
              <PieChart width={200} height={200}>
                <Pie
                  data={data}
                  cx={103}
                  cy={100}
                  innerRadius={40}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>

              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="text-xs font-bold text-gray-600 dark:text-white"
                  style={{ fontFamily: "Comic Sans MS, cursive" }}
                >
                  Daily
                  <br />
                  Macros
                </span>
              </div>

              {data.map((entry, index) => (
                <div
                  key={`label-${index}`}
                  className="absolute text-xs font-bold"
                  style={{
                    left: `${
                      100 + Math.cos(2 * Math.PI * (index / 3 + 0.25)) * 95
                    }px`,
                    top: `${
                      100 + Math.sin(2 * Math.PI * (index / 3 + 0.25)) * 95
                    }px`,
                    color: entry.color,
                  }}
                >
                  {entry.value}%
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2">
              {data.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span
                    className="text-sm"
                    style={{
                      fontFamily: "Comic Sans MS, cursive",
                      color: item.color,
                    }}
                  >
                    {item.name}: {item.grams}g
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;
