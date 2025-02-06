import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/utils/ui/button";
import { Upload, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import MetricsCard from "@/components/MetricsCard";
import FoodDetails from "@/components/FoodDetails";
import UploadSection from "@/components/UploadSection";
import { toast } from "react-hot-toast";

const defaultUserData = {
  username: "Guest",
  weight: 0,
  height: "",
  bmi: 0,
  dailyCalories: 0,
  gender: "",
  activityLevel: "",
  targetWeight: 0,
  macros: {
    protein: "0",
    carbs: "0",
    fat: "0",
    percentages: {
      protein: 0,
      carbs: 0,
      fat: 0,
    },
  },
};

const nutritionMyths = [
  {
    myth: "Eating late at night always makes you gain weight 🌙",
    icon: "🤔",
  },
  {
    myth: "All fats are bad for you 🥑",
    icon: "❌",
  },
  {
    myth: "You need protein immediately after working out 💪",
    icon: "⏰",
  },
  {
    myth: "Carbs are your enemy 🍞",
    icon: "🎯",
  },
  {
    myth: "Detox diets cleanse your body 🥤",
    icon: "🌿",
  },
  {
    myth: "Eating eggs raises cholesterol too much 🥚",
    icon: "🔬",
  },
  {
    myth: "You must eat every 2-3 hours to boost metabolism ⌚",
    icon: "🔄",
  },
  {
    myth: "Muscle will turn into fat if you stop working out 💪",
    icon: "⚡",
  },
  {
    myth: "All calories are equal, regardless of source 🍔",
    icon: "⚖️",
  },
  {
    myth: "Going gluten-free automatically means healthier 🌾",
    icon: "🌟",
  },
  {
    myth: "You need supplements to build muscle 💊",
    icon: "💪",
  },
  {
    myth: "Spot reduction fat loss is possible 🎯",
    icon: "🔍",
  },
  {
    myth: "Breakfast is the most important meal 🍳",
    icon: "☀️",
  },
  {
    myth: "Fresh is always better than frozen 🥶",
    icon: "❄️",
  },
  {
    myth: "Brown sugar is healthier than white sugar 🍯",
    icon: "🤨",
  },
];

const HeroSection = () => {
  const [userData, setUserData] = useState(defaultUserData);
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [nutritionData, setNutritionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [currentMythIndex, setCurrentMythIndex] = useState(0);

  useEffect(() => {
    const mythInterval = setInterval(() => {
      setCurrentMythIndex((prev) => (prev + 1) % nutritionMyths.length);
    }, 2000);

    return () => clearInterval(mythInterval);
  }, []);

  useEffect(() => {
    const fetchUserMetrics = async () => {
      try {
        const response = await fetch("/api/getUserMetrics");
        if (response.status === 401 || response.status === 404) {
          setUserData(defaultUserData);
          setIsDataLoading(false);
          return;
        }

        if (!response.ok) throw new Error("Failed to fetch user metrics");

        const data = await response.json();
        if (data.success) {
          const metrics = data.metrics;
          // Parse macros string from DB
          const macros = metrics.macros
            ? JSON.parse(metrics.macros)
            : defaultUserData.macros;

          setUserData({
            ...metrics,
            macros,
          });
        }
      } catch (error) {
        console.error("Error fetching user metrics:", error);
        setUserData(defaultUserData);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchUserMetrics();
  }, []);

  const handleUpdateMetrics = (updatedMetrics) => {
    try {
      // Parse macros if it's a string
      const macros =
        typeof updatedMetrics.macros === "string"
          ? JSON.parse(updatedMetrics.macros)
          : updatedMetrics.macros;

      setUserData((prev) => ({
        ...prev,
        ...updatedMetrics,
        macros,
      }));

      toast.success("Metrics updated successfully!");
    } catch (error) {
      console.error("Error updating metrics:", error);
      toast.error("Failed to update metrics");
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setImageFile(file);
    setImage(URL.createObjectURL(file));
    setNutritionData(null);
  }, []);

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setImage(null);
    setImageFile(null);
    setNutritionData(null);
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

      const data = await analysisRes.json();

      if (!analysisRes.ok || data.error) {
        // Show appropriate toast based on error type
        if (data.error === "FOOD_ANALYSIS_ERROR") {
          toast.error("Please upload a food image or try again", {
            duration: 3000,
            style: {
              border: "1px solid #ff4b4b",
              padding: "16px",
              color: "#ff4b4b",
            },
          });
        } else {
          toast.error("Failed to analyze image", {
            duration: 4000,
            style: {
              border: "1px solid #ff4b4b",
              padding: "20px",
              color: "#ff4b4b",
            },
          });
        }
        return;
      }

      setNutritionData(data);
    } catch (error) {
      // Only show toast for unexpected errors
      toast.error("Failed to analyze image", {
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
  };

  const handleImageCapture = (dataUrl) => {
    const file = dataURLtoFile(dataUrl, "camera-capture.jpg");
    setImageFile(file);
    setImage(URL.createObjectURL(file));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    noClick: false,
    noKeyboard: false,
  });

  if (isDataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const renderUploadSection = () => {
    if (isLoading) {
      return (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex items-center text-black dark:text-white justify-center space-x-3">
            <motion.div
              className="h-4 w-4 bg-blue-500 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: 0,
              }}
            />
            <motion.div
              className="h-4 w-4 bg-blue-500 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: 0.2,
              }}
            />
            <motion.div
              className="h-4 w-4 bg-blue-500 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: 1,
              }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentMythIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                enter: {
                  duration: 0.2,
                  ease: "easeOut",
                },
                exit: {
                  duration: 0.2,
                  delay: 1, // Content stays visible for 0.8s before exit animation
                  ease: "easeIn",
                },
              }}
              className="bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-xl"
            >
              <div className="text-3xl mb-2">
                {nutritionMyths[currentMythIndex].icon}
              </div>
              <p className="text-lg italic text-gray-800 dark:text-blue-200">
                {nutritionMyths[currentMythIndex].myth}
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      );
    }

    if (nutritionData) {
      return (
        <div className="w-full pointer-events-none">
          <div className="pointer-events-auto">
            <UploadSection
              getRootProps={getRootProps}
              getInputProps={getInputProps}
              onImageCapture={handleImageCapture}
            />
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="w-full">
          <AnimatePresence>
            {!image ? (
              <div className="w-full pointer-events-none">
                <div className="pointer-events-auto">
                  <UploadSection
                    getRootProps={getRootProps}
                    getInputProps={getInputProps}
                    onImageCapture={handleImageCapture}
                  />
                </div>
              </div>
            ) : (
              <motion.div
                className="relative w-full h-64"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-2 rounded-full bg-red-500 hover:bg-red-600 border border-white/50 shadow-lg transform transition-all duration-100 ease-in-out hover:scale-110 group z-10"
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6 text-white group-hover:text-gray-100 transition-colors" />
                </motion.button>
                <Image
                  src={image}
                  alt="Uploaded food"
                  layout="fill"
                  objectFit="contain"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {image && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.2 }}
              className="relative mt-4"
            >
              <Button
                onClick={handleGetDetails}
                className="w-full bg-gradient-to-r from-blue-400/90 via-blue-500/90 to-blue-400/90 
                text-white font-medium text-2xl py-3 rounded-lg transition-all hover:shadow-lg"
              >
                Get Details
              </Button>
            </motion.div>
          )}
        </div>
      </>
    );
  };

  return (
    <motion.section
      className="min-h-screen w-full mt-10 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 dark:from-gray-900 dark:to-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-20 relative">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <motion.div
            className="space-y-8"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="space-y-2 relative">
              <h1 className="text-4xl py-2 md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
                Hi, {userData.username}! 🌟
              </h1>
              <p className="text-xl md:text-2xl font-light text-blue-600 dark:text-blue-300 italic">
                "Your health is an investment, not an expense!"
              </p>
            </div>

            <div className="flex flex-col space-y-4">
              {renderUploadSection()}
            </div>
          </motion.div>

          <motion.div
            className="sticky top-8"
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <MetricsCard
              username={userData.username}
              weight={userData.weight}
              height={userData.height}
              bmi={userData.bmi}
              dailyCalories={userData.dailyCalories}
              age={userData.age}
              activityLevel={userData.activityLevel}
              macros={userData.macros}
              targetWeight={userData.targetWeight}
              gender={userData.gender}
              userId={userData.userId}
              onUpdateMetrics={handleUpdateMetrics}
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
            <FoodDetails nutritionData={nutritionData} foodImage={image} />
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default HeroSection;

const dataURLtoFile = (dataurl, filename) => {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};
