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
  Ruler,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/utils/ui/button";
import { motion, AnimatePresence } from "framer-motion";

// First, include the getBmiStatus and getActivityDescription helper functions
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
    mostly_inactive: "Little or no exercise",
    somewhat_active: "Light exercise 1-3 days/week",
    active: "Moderate exercise 3-5 days/week",
    very_active: "Hard exercise 6-7 days/week",
  };
  return descriptions[level] || "";
};

// Include the enhanced EditMetricsForm component
const EditMetricsForm = ({ initialData, onUpdate, onClose, isLoading }) => {
  // Split initial height into feet and inches
  const splitInitialHeight = () => {
    const heightMatch = initialData.height.match(/(\d+)'(\d+)"/);
    return {
      heightFt: heightMatch ? heightMatch[1] : "",
      heightIn: heightMatch ? heightMatch[2] : "",
    };
  };

  const [formData, setFormData] = useState({
    weight: initialData.weight,
    heightFt: splitInitialHeight().heightFt,
    heightIn: splitInitialHeight().heightIn,
    age: initialData.age,
    activityLevel: initialData.activityLevel,
  });

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    // Lock scroll but prevent content shift
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.paddingRight = "var(--scrollbar-width, 0px)";
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty(
      "--scrollbar-width",
      `${scrollbarWidth}px`
    );

    return () => {
      // Restore scroll
      document.documentElement.style.overflow = "";
      document.documentElement.style.paddingRight = "";
      document.documentElement.style.removeProperty("--scrollbar-width");
    };
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.weight || formData.weight <= 0) {
      errors.weight = "Please enter a valid weight";
    }
    if (!formData.heightFt || formData.heightFt <= 0) {
      errors.heightFt = "Please enter valid feet";
    }
    if (!formData.heightIn || formData.heightIn < 0 || formData.heightIn > 11) {
      errors.heightIn = "Please enter valid inches (0-11)";
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

    // Convert height to required format
    const formattedData = {
      ...formData,
      height: `${formData.heightFt}'${formData.heightIn}"`,
    };
    delete formattedData.heightFt;
    delete formattedData.heightIn;

    await onUpdate(formattedData);
  };

  const activityLevels = [
    {
      value: "mostly_inactive",
      label: "Mostly Inactive",
      icon: "🛋️",
      description: "Little or no exercise",
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
    <div className="fixed inset-0 z-[999] overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal wrapper */}
      <div className="relative min-h-screen flex items-center justify-center px-4 py-6 sm:py-12">
        <div
          className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-5 sm:p-6 rounded-t-2xl">
            <h2 className="text-xl sm:text-2xl font-bold text-white text-center">
              Update Your Metrics
            </h2>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-white/90 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
            {/* Weight Input */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <Scale className="w-4 h-4 mr-2" />
                Weight (kg)
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full p-3 text-[16px] rounded-xl border bg-white dark:bg-gray-700 
                       border-gray-200 dark:border-gray-600 
                       focus:border-blue-500 dark:focus:border-blue-400
                       focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20
                       outline-none"
                placeholder="Enter weight in kg"
              />
            </div>

            {/* Height Inputs */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <Ruler className="w-4 h-4 mr-2" />
                Height
              </label>
              <div className="grid grid-cols-2 gap-4">
                {["heightFt", "heightIn"].map((heightType) => (
                  <input
                    key={heightType}
                    type="number"
                    name={heightType}
                    value={formData[heightType]}
                    onChange={handleChange}
                    className="w-full p-3 text-[16px] rounded-xl border bg-white dark:bg-gray-700 
                           border-gray-200 dark:border-gray-600 
                           focus:border-blue-500 dark:focus:border-blue-400
                           focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20
                           outline-none"
                    placeholder={heightType === "heightFt" ? "Feet" : "Inches"}
                  />
                ))}
              </div>
            </div>

            {/* Age Input */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <Calendar className="w-4 h-4 mr-2" />
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full p-3 text-[16px] rounded-xl border bg-white dark:bg-gray-700 
                       border-gray-200 dark:border-gray-600 
                       focus:border-blue-500 dark:focus:border-blue-400
                       focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20
                       outline-none"
                placeholder="Enter your age"
              />
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
                  className="w-full h-11 pl-3 pr-10 text-[16px] rounded-xl border bg-white dark:bg-gray-700 
               border-gray-200 dark:border-gray-600 
               focus:border-blue-500 dark:focus:border-blue-400
               focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20
               outline-none appearance-none"
                >
                  <option value="">Select Activity Level</option>
                  {activityLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
                {/* Single dropdown arrow */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Buttons */}
            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 text-sm font-medium
             bg-gray-100 dark:bg-gray-700 rounded-xl
             hover:bg-gray-200 dark:hover:bg-gray-600
             disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white
             bg-gradient-to-r from-blue-600 to-purple-600
             hover:from-blue-700 hover:to-purple-700
             rounded-xl disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    <span>Updating...</span>
                  </div>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Main MetricsCard component
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
  const [isUpdating, setIsUpdating] = useState(false);

  const bmiInfo = getBmiStatus(bmi);
  const activityDescription = getActivityDescription(activityLevel);

  const handleUpdateMetrics = async (formData) => {
    if (isUpdating) return; // Prevent double submission
    setIsLoading(true);
    setIsUpdating(true);

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

      const data = await response.json();
      // console.log(data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to update metrics");
      }

      if (data.success) {
        setIsEditModalOpen(false);
        onUpdateMetrics(data.metrics);
      }
    } catch (error) {
      console.error("Error updating metrics:", error);
      toast.error(error.message || "Failed to update metrics", {
        id: "metrics-error-" + new Date().getTime(),
      });
    } finally {
      setIsLoading(false);
      setIsUpdating(false);
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
    const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
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
      {/* Main container with adjusted padding */}
      <div className="relative p-2 sm:p-3 md:p-4">
        {/* Background blur effects stay the same */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-300 dark:from-gray-800 dark:to-gray-900 transform rotate-1 rounded-3xl blur-xl"></div>

        {/* Main content container */}
        <div className="relative p-3 sm:p-4 md:p-6 bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl shadow-2xl">
          {/* Header with reduced bottom margin */}
          <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6 px-2">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {username}'s Health Metrics
            </h2>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer group"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors hidden sm:inline-block">
                Edit
              </span>
              <Edit className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            </button>
          </div>

          {/* Main grid layout with updated breakpoints */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {/* Left Column - Current Stats */}
            <div className="space-y-3 sm:space-y-4">
              {/* Weight & Target Weight */}
              {Math.abs(weightDiff) > 0.1 ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2 sm:p-3 rounded-xl bg-blue-50 dark:bg-gray-700 text-center relative">
                    <Scale className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 text-blue-500" />
                    <div className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400 flex items-center justify-center gap-1">
                      <span>{weight}</span>
                      <span className="text-xs">kg</span>
                    </div>
                    <div className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                      Current Weight
                    </div>
                  </div>

                  <div className="p-2 sm:p-3 rounded-xl bg-green-50 dark:bg-gray-700 text-center relative">
                    {/* Similar adjustments for target weight card */}
                    <Target className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 text-green-500" />
                    <div className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400 flex items-center justify-center gap-1">
                      <span>{targetWeight}</span>
                      <span className="text-xs">kg</span>
                    </div>
                    <div className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                      Target Weight
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center justify-center gap-1">
                      <WeightIcon className="w-3 h-3" />
                      {Math.abs(weightDiff).toFixed(1)} kg to go
                    </div>
                  </div>
                </div>
              ) : (
                // Show single celebratory display when target is reached
                <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 text-center">
                  {/* Perfect weight celebration content */}
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

              {/* Height & Age with reduced spacing */}
              <div className="p-2 sm:p-3 rounded-xl bg-purple-50 dark:bg-gray-700">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <Activity className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 text-purple-500" />
                    <div className="text-base sm:text-lg font-bold text-purple-600 dark:text-purple-400">
                      {height}
                    </div>
                    <div className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                      Height
                    </div>
                  </div>
                  <div className="text-center">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 text-purple-500" />
                    <div className="text-base sm:text-lg font-bold text-purple-600 dark:text-purple-400">
                      {age}
                    </div>
                    <div className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                      Age
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Level */}
              <div className="p-2 sm:p-3 rounded-xl bg-indigo-50 dark:bg-gray-700">
                <div className="text-center">
                  <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 text-indigo-500" />
                  <div className="text-base sm:text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    {activityLevel
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </div>
                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                    {activityDescription}
                  </div>
                </div>
              </div>

              {/* BMI Status */}
              <div className={`p-2 sm:p-3 rounded-xl ${bmiInfo.bgColor}`}>
                <div className="text-center">
                  <div
                    className={`text-lg sm:text-xl font-bold ${bmiInfo.color}`}
                  >
                    {bmiInfo.status}
                  </div>
                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                    {bmiInfo.description}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Macros */}
            <div className="space-y-3 sm:space-y-4">
              {/* Daily Calories */}
              <div className="p-2 sm:p-3 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-center">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 text-blue-500" />
                <div className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">
                  {dailyCalories} kcal/day
                </div>
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                  Daily Calorie Goal
                </div>
              </div>

              {/* Pie Chart with adjusted height */}
              <div className="h-40 sm:h-44 md:h-48 bg-white/50 dark:bg-gray-800/50 rounded-xl p-2 sm:p-3">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={45}
                      paddingAngle={4}
                      dataKey="value"
                      label={renderCustomizedLabel}
                      strokeWidth={0}
                    >
                      {data.map((entry, index) => (
                        <Cell key={index} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Macros Legend with reduced spacing */}
              <div className="grid grid-cols-3 gap-2 bg-white/50 dark:bg-gray-800/50 rounded-xl p-2 sm:p-3">
                {/* Macro sections with smaller text and spacing */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-[#3B82F6]"></div>
                    <div className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {macros.protein}
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">
                    Protein
                  </div>
                  <div className="text-xs font-medium text-gray-500">
                    {macros.percentages.protein}% daily
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                    <div className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {macros.fat}
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">
                    Fat
                  </div>
                  <div className="text-xs font-medium text-gray-500">
                    {macros.percentages.fat}% daily
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <div className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {macros.carbs}
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">
                    Carbs
                  </div>
                  <div className="text-xs font-medium text-gray-500">
                    {macros.percentages.carbs}% daily
                  </div>
                </div>
                {/* Repeat for Carbs and Fats with similar adjustments */}
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
