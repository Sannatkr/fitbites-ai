import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  Edit,
  X,
  Loader2,
  Target,
  Scale,
  Activity,
  Heart,
  Calendar,
  ArrowUp,
  ArrowDown,
  UserCheck,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/utils/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const getBmiStatus = (bmi) => {
  const bmiValue = typeof bmi === "string" ? parseFloat(bmi) : bmi;

  if (bmiValue < 18.5)
    return {
      status: "Underweight",
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/20",
      description: `BMI: ${bmiValue.toFixed(1)} (Below 18.5)`,
    };

  if (bmiValue <= 24.9)
    return {
      status: "Normal Weight",
      color: "text-green-500",
      bgColor: "bg-green-500/20",
      description: `BMI: ${bmiValue.toFixed(1)} (18.5 - 24.9)`,
    };

  return {
    status: "Overweight",
    color: "text-red-500",
    bgColor: "bg-red-500/20",
    description: `BMI: ${bmiValue.toFixed(1)} (Above 24.9)`,
  };
};

const getActivityDescription = (level) => {
  const descriptions = {
    mostly_inactive: "Little to no exercise",
    somewhat_active: "Light exercise 1-3 days/week",
    active: "Moderate exercise 3-5 days/week",
    very_active: "Hard exercise 6-7 days/week",
  };
  return descriptions[level] || "";
};

// Keep EditMetricsForm component as is...
// ... (your existing EditMetricsForm code stays exactly the same)

const EditMetricsForm = ({ initialData, onUpdate, onClose, isLoading }) => {
  const [formData, setFormData] = useState({
    weight: initialData.weight,
    height: initialData.height,
    age: initialData.age,
    activityLevel: initialData.activityLevel,
  });
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.weight || formData.weight <= 0) {
      errors.weight = "Please enter a valid weight";
    }
    if (!formData.height || !formData.height.includes("'")) {
      errors.height = "Please enter height in format: 5'8\"";
    }
    if (!formData.age || formData.age <= 0) {
      errors.age = "Please enter a valid age";
    }
    if (!formData.activityLevel) {
      errors.activityLevel = "Please select activity level";
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    await onUpdate(formData);
  };

  const activityLevels = [
    {
      value: "mostly_inactive",
      label: "Mostly Inactive",
      icon: "🛋️",
      description: "Little to no exercise",
    },
    {
      value: "somewhat_active",
      label: "Somewhat Active",
      icon: "🚶",
      description: "Light exercise 1-3 days/week",
    },
    {
      value: "active",
      label: "Active",
      icon: "🏃",
      description: "Moderate exercise 3-5 days/week",
    },
    {
      value: "very_active",
      label: "Very Active",
      icon: "💪",
      description: "Hard exercise 6-7 days/week",
    },
  ];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
    >
      <motion.div
        className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6">
          <h2 className="text-2xl font-bold text-white text-center">
            Update Your Metrics
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Weight Input */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <Scale className="w-4 h-4 mr-2" />
              Weight (kg)
            </label>
            <div className="relative">
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${
                  validationErrors.weight
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                } bg-white dark:bg-gray-700 focus:ring-2 outline-none transition-all`}
                placeholder="Enter weight in kg"
              />
              {validationErrors.weight && (
                <p className="mt-1 text-sm text-red-500">
                  {validationErrors.weight}
                </p>
              )}
            </div>
          </div>

          {/* Height Input */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <Activity className="w-4 h-4 mr-2" />
              Height
            </label>
            <div className="relative">
              <input
                type="text"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${
                  validationErrors.height
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                } bg-white dark:bg-gray-700 focus:ring-2 outline-none transition-all`}
                placeholder="Format: 5'8\"
              />
              {validationErrors.height && (
                <p className="mt-1 text-sm text-red-500">
                  {validationErrors.height}
                </p>
              )}
            </div>
          </div>

          {/* Age Input */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <Calendar className="w-4 h-4 mr-2" />
              Age
            </label>
            <div className="relative">
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${
                  validationErrors.age
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                } bg-white dark:bg-gray-700 focus:ring-2 outline-none transition-all`}
                placeholder="Enter your age"
              />
              {validationErrors.age && (
                <p className="mt-1 text-sm text-red-500">
                  {validationErrors.age}
                </p>
              )}
            </div>
          </div>

          {/* Activity Level Select */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <Heart className="w-4 h-4 mr-2" />
              Activity Level
            </label>
            <div className="relative">
              <select
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${
                  validationErrors.activityLevel
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                } bg-white dark:bg-gray-700 focus:ring-2 outline-none transition-all`}
              >
                <option value="">Select Activity Level</option>
                {activityLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.icon} {level.label} - {level.description}
                  </option>
                ))}
              </select>
              {validationErrors.activityLevel && (
                <p className="mt-1 text-sm text-red-500">
                  {validationErrors.activityLevel}
                </p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition-all duration-200"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const MetricsCard = ({
  username,
  weight,
  height,
  bmi,
  dailyCalories,
  age,
  activityLevel,
  macros,
  targetWeight,
  gender,
  userId,
  onUpdateMetrics,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const bmiInfo = getBmiStatus(bmi);
  const activityDescription = getActivityDescription(activityLevel);

  const handleUpdateMetrics = async (formData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/healthMetrics/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          gender,
          ...formData,
        }),
      });

      if (!response.ok) throw new Error("Failed to update metrics");

      const data = await response.json();
      if (data.success) {
        onUpdateMetrics(data.metrics);
        toast.success("Metrics updated successfully!");
        setIsEditModalOpen(false);
      } else {
        throw new Error(data.error || "Failed to update metrics");
      }
    } catch (error) {
      console.error("Error updating metrics:", error);
      toast.error(error.message || "Failed to update metrics");
    } finally {
      setIsLoading(false);
    }
  };

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="currentColor"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-sm font-bold dark:text-white text-gray-900"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const data = [
    { name: "Proteins", value: macros.percentages.protein, color: "#3B82F6" },
    { name: "Carbs", value: macros.percentages.carbs, color: "#10B981" },
    { name: "Fats", value: macros.percentages.fat, color: "#F59E0B" },
  ];

  const weightDiff = targetWeight - weight;
  const WeightIcon = weightDiff > 0 ? ArrowUp : ArrowDown;

  return (
    <>
      <div className="relative p-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-purple-300 dark:from-blue-900 dark:to-purple-900 transform rotate-1 rounded-3xl blur-md"></div>
        <div className="relative p-4 sm:p-8 bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 sm:mb-8 px-2 sm:px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {username}'s Health Journey ✨
            </h2>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer group"
            >
              <span className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors hidden sm:inline-block">
                Edit
              </span>
              <Edit className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Left Column - Current Stats */}
            <div className="space-y-6">
              {/* Weight & Target Weight */}
              {Math.abs(weightDiff) > 0.1 ? (
                // Show both current and target when different
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-blue-50 dark:bg-gray-700 text-center relative">
                    <Scale className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 flex items-center justify-center gap-2">
                      <span>{weight}</span>
                      <span className="text-sm">kg</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                      Current Weight
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-green-50 dark:bg-gray-700 text-center relative">
                    <Target className="w-6 h-6 mx-auto mb-2 text-green-500" />
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400 flex items-center justify-center gap-2">
                      <span>{targetWeight}</span>
                      <span className="text-sm">kg</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                      Target Weight
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center justify-center gap-1">
                      <WeightIcon className="w-4 h-4" />
                      {Math.abs(weightDiff).toFixed(1)} kg to go
                    </div>
                  </div>
                </div>
              ) : (
                // Show single celebratory display when target is reached
                <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 text-center relative">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Target className="w-6 h-6 text-green-500" />
                    <Scale className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 flex items-center justify-center gap-2">
                    <span>{weight}</span>
                    <span className="text-sm">kg</span>
                  </div>
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Perfect Weight 🎉
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center justify-center gap-1">
                    Hold The Line! 💪
                  </div>
                </div>
              )}

              {/* Height & Age */}
              <div className="p-4 rounded-xl bg-purple-50 dark:bg-gray-700">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <Activity className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                    <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                      {height}
                    </div>
                    <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                      Height
                    </div>
                  </div>
                  <div className="text-center">
                    <Calendar className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                    <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                      {age}
                    </div>
                    <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                      Age
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Level */}
              <div className="p-4 rounded-xl bg-indigo-50 dark:bg-gray-700">
                <div className="text-center">
                  <UserCheck className="w-6 h-6 mx-auto mb-2 text-indigo-500" />
                  <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                    {activityLevel
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </div>
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 mt-1">
                    {activityDescription}
                  </div>
                </div>
              </div>

              {/* BMI Status */}
              <div
                className={`p-4 rounded-xl ${bmiInfo.bgColor} transition-colors duration-300`}
              >
                <div className="text-center">
                  <div className={`text-2xl font-bold ${bmiInfo.color}`}>
                    {bmiInfo.status}
                  </div>
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                    {bmiInfo.description}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Macros */}
            <div className="space-y-6">
              {/* Daily Calories */}
              <div className="p-4 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-center">
                <Heart className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {dailyCalories} kcal/day
                </div>
                <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Daily Calorie Goal
                </div>
              </div>

              {/* Pie Chart */}
              <div className="h-64 bg-white/50 dark:bg-gray-800/50 rounded-xl p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                      label={renderCustomizedLabel}
                    >
                      {data.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Macros Legend */}
              <div className="grid grid-cols-3 gap-4 bg-white/50 dark:bg-gray-800/50 rounded-xl p-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <div className="w-3 h-3 rounded-full bg-[#3B82F6]"></div>
                    <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
                      {macros.protein}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Protein
                  </div>
                  <div className="text-xs font-medium text-gray-500">
                    {macros.percentages.protein}% daily
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
                    <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
                      {macros.carbs}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Carbs
                  </div>
                  <div className="text-xs font-medium text-gray-500">
                    {macros.percentages.carbs}% daily
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
                    <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
                      {macros.fat}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Fats
                  </div>
                  <div className="text-xs font-medium text-gray-500">
                    {macros.percentages.fat}% daily
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <EditMetricsForm
            initialData={{ weight, height, age, activityLevel }}
            onUpdate={handleUpdateMetrics}
            onClose={() => setIsEditModalOpen(false)}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default MetricsCard;
