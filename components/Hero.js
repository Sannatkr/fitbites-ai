"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/utils/ui/button";
import { Upload, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import MetricsCard from "@/components/MetricsCard";
import FoodDetails from "@/components/FoodDetails";

const getBmiColor = (bmi) => {
  if (bmi < 18.5) return "from-yellow-400 via-yellow-500 to-green-400";
  if (bmi <= 24.9) return "from-green-400 via-green-500 to-green-600";
  return "from-green-400 via-yellow-500 to-red-500";
};

const calculateDailyCalories = (
  weight,
  height,
  age = 30,
  gender = "female",
  activityLevel = "moderate"
) => {
  const heightInCm =
    parseFloat(height.split("'")[0]) * 30.48 +
    parseFloat(height.split("'")[1]) * 2.54;
  let bmr = 10 * weight + 6.25 * heightInCm - 5 * age;
  bmr = gender === "female" ? bmr - 161 : bmr + 5;

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };

  return Math.round(bmr * activityMultipliers[activityLevel]);
};

const calculateMacros = (calories, bmi) => {
  let proteinPercentage, carbsPercentage, fatsPercentage;

  if (bmi < 18.5) {
    proteinPercentage = 25;
    carbsPercentage = 55;
    fatsPercentage = 20;
  } else if (bmi <= 24.9) {
    proteinPercentage = 30;
    carbsPercentage = 45;
    fatsPercentage = 25;
  } else {
    proteinPercentage = 35;
    carbsPercentage = 35;
    fatsPercentage = 30;
  }

  return {
    protein: Math.round((calories * (proteinPercentage / 100)) / 4),
    carbs: Math.round((calories * (carbsPercentage / 100)) / 4),
    fats: Math.round((calories * (fatsPercentage / 100)) / 9),
    percentages: { proteinPercentage, carbsPercentage, fatsPercentage },
  };
};

const HeroSection = ({
  username = "Sarah",
  weight = 70,
  height = "5'8\"",
  bmi = 22.4,
  onGetDetails,
}) => {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [nutritionData, setNutritionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const dailyCalories = calculateDailyCalories(weight, height);
  const macros = calculateMacros(dailyCalories, bmi);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setImageFile(file);
    setImage(URL.createObjectURL(file));
  }, []);

  const handleRemoveImage = (e) => {
    e.stopPropagation(); // Prevent dropzone from triggering
    setImage(null);
    setImageFile(null);
    setNutritionData(null); // Clear nutrition data when removing image
  };

  const handleGetDetails = async () => {
    if (!imageFile) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const analysisRes = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!analysisRes.ok) throw new Error("Analysis failed");
      const data = await analysisRes.json();
      setNutritionData(data);

      if (onGetDetails) {
        onGetDetails(data);
      }
    } catch (error) {
      console.error("Error processing image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  return (
    <motion.section
      className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 dark:from-gray-900 dark:to-gray-800"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <motion.div
            className="space-y-8"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
                Hi, {username}! 🌟
              </h1>
              <p className="text-xl md:text-2xl font-light text-blue-600 dark:text-blue-300 italic">
                "Your health is an investment, not an expense! 💪"
              </p>
            </div>

            <div className="flex flex-col space-y-4">
              <motion.div
                {...getRootProps()}
                className={`relative w-full shadow-xl dark:shadow-gray-800 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-900 dark:to-gray-800 border-blue-300 dark:border-blue-600 rounded-lg p-8 text-center cursor-pointer`}
              >
                <input {...getInputProps()} />
                <AnimatePresence>
                  {image ? (
                    <motion.div
                      className="relative w-full h-64"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.button
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 p-2 rounded-full backdrop-blur-md bg-white/30 dark:bg-gray-300 hover:bg-white/50 dark:hover:bg-gray-300 border border-white/50 dark:border-gray-700/50 shadow-lg transform transition-all duration-100 ease-in-out hover:scale-110 group z-10"
                        whileHover={{ rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X className="w-6 h-6 text-gray-600 dark:text-black group-hover:text-gray-800 dark:group-hover:text-black transition-colors" />
                      </motion.button>
                      <Image
                        src={image}
                        alt="Uploaded food"
                        layout="fill"
                        objectFit="contain"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      className="flex flex-col items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      // disabled={isLoading}
                    >
                      <Upload className="w-12 h-12 text-blue-500 dark:text-blue-500 mb-4" />
                      <p className="text-blue-600 dark:text-blue-500 font-medium text-lg">
                        Fuel Your Fitness!
                        <br />
                        Upload a photo of your meal to decode its nutrients!
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* <AnimatePresence> */}
              {image && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.2 }}
                  className="relative"
                >
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400/90 via-blue-500/90 to-blue-400/90" />
                    <div className="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-transparent via-white to-transparent opacity-40 " />
                  </div>
                  <Button
                    onClick={handleGetDetails}
                    className={`relative w-full bg-gradient-to-r from-blue-400/90 via-blue-500/90 to-blue-400/90 
                      text-white font-medium text-2xl py-3 rounded-lg transition-all
                      ${
                        isLoading
                          ? "opacity-75 cursor-not-allowed bg-gradient-to-r from-gray-400/90 via-gray-500/90 to-gray-400/90 animate-pulse "
                          : "hover:shadow-lg"
                      }
                       `}
                    disabled={isLoading}
                  >
                    {isLoading ? "Analyzing..." : "Get Details"}
                  </Button>
                </motion.div>
              )}
              {/* </AnimatePresence> */}
            </div>
          </motion.div>

          {/* Right Column - Metrics Card */}
          <motion.div
            className="relative"
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <MetricsCard
              username={username}
              weight={weight}
              height={height}
              bmi={bmi}
              dailyCalories={dailyCalories}
              macros={macros}
            />
          </motion.div>
        </div>

        {nutritionData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.3 }}
          >
            <FoodDetails
              nutritionData={nutritionData}
              foodImage={image} // Pass the image URL
            />
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default HeroSection;
