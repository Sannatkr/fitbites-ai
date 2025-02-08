import React, { useState, useEffect, useCallback, createElement } from "react";
import { Button } from "@/utils/ui/button";
import { Upload, X, ScanSearchIcon, ScrollText, LineChart } from "lucide-react";
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
  caloriesIntake: 0,
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

const buttonStates = [
  {
    text: "Get Details",
    icon: (
      <ScanSearchIcon
        className="w-5 h-5 text-white/90 group-hover:text-white transition-colors"
        strokeWidth={1.5}
      />
    ),
  },
  {
    text: "Decode Nutrients",
    icon: (
      <ScrollText
        className="w-5 h-5 text-white/90 group-hover:text-white transition-colors"
        strokeWidth={1.5}
      />
    ),
  },
  {
    text: "Analyze Meal",
    icon: (
      <LineChart
        className="w-5 h-5 text-white/90 group-hover:text-white transition-colors"
        strokeWidth={1.5}
      />
    ),
  },
];

const HeroSection = () => {
  const [currentButtonIndex, setCurrentButtonIndex] = useState(0);
  const [userData, setUserData] = useState(defaultUserData);
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [nutritionData, setNutritionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [currentMythIndex, setCurrentMythIndex] = useState(0);

  // Button carousel effect
  useEffect(() => {
    if (!image) return;

    const intervalId = setInterval(() => {
      setCurrentButtonIndex((prev) => (prev + 1) % buttonStates.length);
    }, 2000);

    return () => clearInterval(intervalId);
  }, [image]);

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

      console.log("User Data is: ", userData);

      toast.success("Metrics updated successfully!", {
        duration: 4000,
        style: {
          border: "1px solid #10B981", // Success green border
          padding: "16px",
          color: "#10B981", // Success green text
          backgroundColor: "#ECFDF5", // Light green background
          borderRadius: "8px", // Rounded corners
          fontSize: "15px",
          fontWeight: "500",
        },
        iconTheme: {
          primary: "#10B981", // Success green icon
          secondary: "#FFFFFF", // White background for icon
        },
      });
    } catch (error) {
      console.error("Error updating metrics:", error);
      toast.error(error.message || "Failed to update metrics", {
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
        } else {
          toast.error("Failed to analyze image", {
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
        }
        return;
      }

      setNutritionData(data);
      setTimeout(() => {
        const foodDetailsElement = document.querySelector("#food-details");
        if (foodDetailsElement) {
          const yOffset = -80;
          const y =
            foodDetailsElement.getBoundingClientRect().top +
            window.pageYOffset +
            yOffset;

          window.scrollTo({
            top: y,
            behavior: "smooth",
          });
        }
      }, 500); // Increased delay to ensure component is mounted
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
    setNutritionData(null); // Reset nutrition data when new image is captured

    // Scroll back to upload section if FoodDetails is visible
    const uploadSection = document.querySelector("#upload-section");
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: "smooth" });
    }
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
                  delay: 1,
                  ease: "easeIn",
                },
              }}
              className="bg-white/10 backdrop-blur-md rounded-lg p-4 sm:p-6 shadow-xl min-h-[120px] flex flex-col justify-center"
            >
              <div className="text-2xl sm:text-3xl mb-2">
                {nutritionMyths[currentMythIndex].icon}
              </div>
              <p className="text-sm sm:text-lg italic text-gray-800 dark:text-blue-200">
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
        <div className="w-full" id="upload-section">
          <AnimatePresence mode="wait">
            {!image ? (
              <motion.div
                className="w-full"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="pointer-events-auto">
                  <UploadSection
                    getRootProps={getRootProps}
                    getInputProps={getInputProps}
                    onImageCapture={handleImageCapture}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                className="relative w-full"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                {/* Image Container */}
                <div className="relative w-full h-64 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800/50 group">
                  <Image
                    src={image}
                    alt="Uploaded food"
                    layout="fill"
                    objectFit="contain"
                    className="transition-transform duration-300 group-hover:scale-[1.02]"
                  />

                  {/* Delete button */}
                  <motion.button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-2 rounded-full bg-gray-100/90 hover:bg-gray-200/90 
                           dark:bg-gray-700/90 dark:hover:bg-gray-600/90 
                           border border-gray-200/20 shadow-lg z-10
                           transition-all duration-200 hover:scale-105 active:scale-95"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <X className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                  </motion.button>
                </div>

                {/* Always show the Get Details button when there's an image */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: 0.2 }}
                  className="relative mt-4"
                >
                  <Button
                    onClick={handleGetDetails}
                    disabled={isLoading}
                    className="relative w-full bg-gradient-to-r from-blue-600/90 via-purple-500/90 to-blue-600/90
              dark:from-blue-600/90 dark:via-purple-500/90 dark:to-blue-600/90
              text-white font-medium py-3.5 rounded-lg 
              overflow-hidden group shadow-[0_2px_12px_-3px_rgba(99,102,241,0.4)] 
              dark:shadow-[0_2px_12px_-3px_rgba(99,102,241,0.3)]
              border border-blue-400/20 dark:border-purple-400/20
              hover:shadow-[0_4px_16px_-4px_rgba(99,102,241,0.5)] 
              dark:hover:shadow-[0_4px_16px_-4px_rgba(99,102,241,0.4)]
              transition-all duration-300"
                  >
                    {/* Text carousel container */}
                    <div className="relative overflow-hidden h-7">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={buttonStates[currentButtonIndex].text}
                          initial={{ opacity: 0, x: 40 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -40 }}
                          transition={{
                            duration: 0.3,
                            ease: "easeOut",
                          }}
                          className="flex items-center justify-center gap-3 absolute inset-0"
                        >
                          <span className="text-base font-semibold text-white">
                            {isLoading
                              ? "Analyzing..."
                              : buttonStates[currentButtonIndex].text}
                          </span>
                          {isLoading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                          ) : (
                            buttonStates[currentButtonIndex].icon
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Hover effect overlay */}
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-400/20 to-blue-500/0 
                opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </>
    );
  };

  return (
    <motion.section
      className="min-h-screen w-full mt-24 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 dark:from-gray-900 dark:to-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          <motion.div
            className="space-y-6"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="space-y-4 relative">
              {" "}
              {/* Increased space between elements */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
                Hi, {userData.username}! 🌟
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl font-light text-blue-600 dark:text-blue-300 italic">
                "Your health is an investment, not an expense!"
              </p>
            </div>

            <div className="flex flex-col space-y-6">
              {/* Increased spacing */}
              {renderUploadSection()}
            </div>
          </motion.div>

          <motion.div
            className="lg:sticky lg:top-24" // Increased top spacing for sticky positioning
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <MetricsCard
              username={userData.username}
              weight={userData.weight}
              height={userData.height}
              bmi={userData.bmi}
              dailyCalories={userData.caloriesIntake}
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
            id="food-details" // Add this ID
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.3 }}
            className="mt-12 lg:mt-16" // Increased margin top
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
