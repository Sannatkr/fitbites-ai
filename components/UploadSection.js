import { useRef, useState, useEffect } from "react";
import { Upload, Camera, ImagePlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/utils/ui/button";
import { toast } from "react-hot-toast";

const uploadTips = [
  {
    icon: "🍲",
    text: "Snap your meal, unlock its secrets!",
  },
  {
    icon: "📱",
    text: "Quick snap with your camera",
  },
  {
    icon: "🖼️",
    text: "Upload from your gallery",
  },
  {
    icon: "✨",
    text: "Get instant nutrition insights",
  },
];

const UploadSection = ({ getRootProps, getInputProps, onImageCapture }) => {
  const [currentTip, setCurrentTip] = useState(0);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % uploadTips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle camera setup when modal opens
  useEffect(() => {
    if (showCamera && videoRef.current) {
      startCamera();
    }
    return () => stopCamera();
  }, [showCamera]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (error) {
      console.error("Camera error:", error);
      toast.error("Could not access camera");
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleCameraClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowCamera(true);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");

    // Set canvas size to match video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    onImageCapture(dataUrl);
    setShowCamera(false);
  };

  // Keep all the imports and component logic the same, just update the JSX/styling
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Enhanced Carousel with minimal styling */}
      <div className="mb-8 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTip}
            initial={{ opacity: 0, x: -10 }} // Reduced movement distance
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{
              duration: 0.3, // Slightly faster transition
              ease: "easeOut", // Changed to easeOut for smoother feel
            }}
            className="relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6"
          >
            <div className="flex items-center gap-6">
              <motion.div
                className="text-4xl min-w-[60px] flex justify-center"
                animate={{ y: [-2, 2] }} // Simplified animation
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              >
                {uploadTips[currentTip].icon}
              </motion.div>

              <motion.p
                className="text-lg sm:text-xl font-medium text-gray-700 dark:text-gray-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.2, // Faster text fade
                  delay: 0.1, // Reduced delay
                }}
              >
                <span className="text-blue-500 dark:text-blue-400 mr-2">
                  //
                </span>
                {uploadTips[currentTip].text}
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Minimal Pagination Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {uploadTips.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentTip(index)}
              whileHover={{ scale: 1.2 }}
              className={`h-2 w-2 rounded-full transition-all ${
                currentTip === index
                  ? "bg-blue-500 dark:bg-blue-400"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Action Buttons with minimal styling */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <button
            {...getRootProps()}
            className="w-full h-full bg-blue-500 dark:bg-blue-600 rounded-xl p-6 text-white hover:bg-blue-600 dark:hover:bg-blue-700 transition-all duration-300"
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-3">
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ImagePlus size={32} className="opacity-90" />
              </motion.div>
              <div>
                <h3 className="text-lg font-medium">Upload Photo</h3>
                <p className="text-sm text-white/80">From your gallery</p>
              </div>
            </div>
          </button>
        </motion.div>

        <motion.button
          onClick={handleCameraClick}
          whileHover={{ y: -2 }}
          className="w-full bg-emerald-500 dark:bg-emerald-600 rounded-xl p-6 text-white hover:bg-emerald-600 dark:hover:bg-emerald-700 transition-all duration-300"
        >
          <div className="flex flex-col items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Camera size={32} className="opacity-90" />
            </motion.div>
            <div>
              <h3 className="text-lg font-medium">Take Photo</h3>
              <p className="text-sm text-white/80">Use your camera</p>
            </div>
          </div>
        </motion.button>
      </div>

      {/* Camera Modal with minimal styling and larger view */}
      {showCamera && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-50 flex flex-col md:items-center md:justify-center"
          onClick={() => setShowCamera(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full md:w-[90%] lg:w-[80%] h-screen md:h-[85vh] md:max-h-[800px] md:rounded-2xl overflow-hidden bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Video Container */}
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Controls Overlay */}
              <div className="absolute bottom-0 inset-x-0 pb-10 md:pb-6 flex flex-col items-center gap-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-20">
                {/* Capture Button */}
                <motion.button
                  onClick={capturePhoto}
                  className="group relative"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Outer ring with pulse effect */}
                  <div className="absolute inset-0 rounded-full bg-white/20 blur-md animate-pulse" />

                  {/* Main button ring */}
                  <div className="relative h-16 w-16 rounded-full border-4 border-white/80 flex items-center justify-center">
                    {/* Inner circle */}
                    <div
                      className="h-12 w-12 rounded-full bg-white/90 group-hover:bg-white 
                               transition-all duration-200 flex items-center justify-center"
                    >
                      <div
                        className="h-11 w-11 rounded-full bg-red-500 group-hover:bg-red-600 
                                 transition-colors duration-200"
                      />
                    </div>
                  </div>
                </motion.button>

                {/* Cancel Button */}
                <motion.button
                  onClick={() => setShowCamera(false)}
                  className="px-6 py-2.5 text-white/90 hover:text-white text-sm font-medium
                         bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default UploadSection;
