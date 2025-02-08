import { useState } from "react";
import { Phone, Loader2, Salad } from "lucide-react";

export default function LoginForm({ onSuccess, onNewUser }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      if (data.exists) {
        onSuccess(data.token);
      } else {
        onNewUser(phoneNumber);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 sm:p-8">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-12 shadow-2xl">
        <div className="mb-8 sm:mb-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 sm:w-24 h-20 sm:h-24 bg-blue-400/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative">
            <div className="flex items-center justify-center mb-4 gap-2 sm:gap-3">
              <h1 className="text-xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 bg-clip-text text-transparent animate-gradient">
                Welcome to FitBites AI
              </h1>
            </div>
            <p className="text-[12px] sm:text-xl text-gray-600 dark:text-gray-300 font-light tracking-wide">
              Your personal nutrition assistant
            </p>
            <div className="absolute w-full h-1 bottom-0 left-0 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-slide" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          <div className="relative group">
            <div
              className={`absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 rounded-xl sm:rounded-2xl blur transition-all duration-500 group-hover:opacity-100 ${
                isFocused ? "opacity-100" : "opacity-0"
              }`}
            />

            <div className="relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl">
              <div className="flex items-center space-x-2 sm:space-x-4 bg-gray-50 dark:bg-gray-900 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-4 sm:py-5">
                <Phone className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Enter your phone number"
                  className="block w-full outline-none bg-transparent text-[11px] sm:text-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-0"
                  required
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-100/10 rounded-xl p-3 sm:p-4 flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="relative w-full group overflow-hidden rounded-xl text-sm sm:text-lg font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 group-hover:opacity-90 transition-opacity" />
            <div className="relative flex items-center justify-center backdrop-blur-sm px-2 sm:px-6 py-2 sm:py-4 text-white">
              {loading ? (
                <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin mr-2 sm:mr-3" />
              ) : null}
              <span>
                {loading ? "Verifying..." : "Continue to FitBites AI"}
              </span>
            </div>
          </button>
        </form>

        <div className="mt-6 sm:mt-8 text-center text-[11px] sm:text-sm text-gray-500 dark:text-gray-400">
          By continuing, you agree to our{" "}
          <a href="#" className="text-blue-400 hover:text-blue-500">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-400 hover:text-blue-500">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}

// Add these custom animations to your global CSS
const styleTag = document.createElement("style");
styleTag.textContent = `
  @keyframes slide {
    from { transform: translateX(-100%); }
    to { transform: translateX(100%); }
  }

  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .animate-slide {
    animation: slide 3s linear infinite;
  }

  .animate-gradient {
    background-size: 200% auto;
    animation: gradient 3s linear infinite;
  }
`;
