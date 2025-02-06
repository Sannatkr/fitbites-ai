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

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Enhanced Carousel */}
      <div className="mb-10 relative group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTip}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4 }}
            className="relative bg-gradient-to-br from-blue-50/20 to-purple-50/10 dark:from-blue-900/20 dark:to-purple-900/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 dark:border-gray-700/50"
          >
            {/* Decorative Gradient Line */}
            <div className="absolute left-16 top-1/2 -translate-y-1/2 h-3/5 w-1 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full" />

            <div className="flex items-center gap-6 pl-8">
              {/* Animated Emoji Container */}
              <motion.div
                className="text-5xl min-w-[80px] flex justify-center items-end"
                animate={{ y: [0, -5, 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                {uploadTips[currentTip].icon}
              </motion.div>

              {/* Text Content */}
              <div className="relative overflow-hidden">
                <motion.p
                  className="text-2xl font-medium bg-gradient-to-r from-blue-600 to-purple-500 dark:from-blue-300 dark:to-purple-300 bg-clip-text text-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-white/50 dark:text-gray-500 mr-2">
                    //
                  </span>
                  {uploadTips[currentTip].text}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Modern Pagination Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {uploadTips.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentTip(index)}
              whileHover={{ scale: 1.2 }}
              className={`relative h-3 w-3 rounded-full transition-all ${
                currentTip === index
                  ? "bg-gradient-to-br from-blue-400 to-purple-400 shadow-glow"
                  : "bg-gray-300/50 dark:bg-gray-600/50 hover:bg-gray-400"
              }`}
            >
              {currentTip === index && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-white/20"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Premium Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <motion.div
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <button
            {...getRootProps()}
            className="w-full h-full bg-gradient-to-br from-blue-600/90 to-purple-600/90 rounded-2xl p-8 backdrop-blur-lg border border-white/20 shadow-2xl hover:shadow-blue-purple-glow transition-all duration-300 group"
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4 text-white">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ImagePlus
                  size={40}
                  className="opacity-90 group-hover:opacity-100"
                />
              </motion.div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold tracking-tight">
                  Upload Photo
                </h3>
                <p className="text-sm opacity-90 font-light">
                  From your gallery
                </p>
              </div>
            </div>
          </button>
        </motion.div>

        <motion.button
          onClick={(e) => {
            e.preventDefault();
            setShowCamera(true);
          }}
          whileHover={{ y: -5 }}
          className="w-full bg-gradient-to-br from-emerald-600/90 to-cyan-600/90 rounded-2xl p-8 backdrop-blur-lg border border-white/20 shadow-2xl hover:shadow-emerald-cyan-glow transition-all duration-300 group"
        >
          <div className="flex flex-col items-center gap-4 text-white">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Camera
                size={40}
                className="opacity-90 group-hover:opacity-100"
              />
            </motion.div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold tracking-tight">Take Photo</h3>
              <p className="text-sm opacity-90 font-light">Use your camera</p>
            </div>
          </div>
        </motion.button>
      </div>

      {/* Premium Camera Modal */}
      {showCamera && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-3xl z-50 flex items-center justify-center p-4"
          onClick={() => setShowCamera(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 w-full max-w-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video mb-6 bg-gray-800 rounded-xl overflow-hidden border border-white/10">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_60%,_rgba(0,0,0,0.6))]" />
            </div>

            <div className="flex flex-col items-center gap-6">
              <Button
                onClick={capturePhoto}
                className="h-16 w-16 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-lg relative"
              >
                <div className="absolute inset-0 animate-pulse-border rounded-full" />
                <div className="h-12 w-12 rounded-full bg-red-500/90 hover:bg-red-400 transition-all" />
              </Button>

              <Button
                variant="ghost"
                onClick={() => setShowCamera(false)}
                className="text-white/80 hover:text-white px-6 py-3 hover:bg-white/10 rounded-xl transition-all"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default UploadSection;
