import { useState } from "react";
import { User, Scale, Ruler, Activity, Calendar } from "lucide-react";

const WelcomeForm = ({ phoneNumber, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    age: "",
    weight: "",
    heightFt: "",
    heightIn: "",
    activityLevel: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedInput, setFocusedInput] = useState("");

  const activityLevels = [
    { value: "mostly_inactive", label: "Mostly Inactive", icon: "🛋️" },
    { value: "somewhat_active", label: "Somewhat Active", icon: "🚶" },
    { value: "active", label: "Active", icon: "🏃" },
    { value: "very_active", label: "Very Active", icon: "💪" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/healthMetrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, phoneNumber }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      onSuccess(data.token);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-10 sm:mt-12 py-4 px-1 sm:p-8">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-12 shadow-2xl">
        <div className="mb-8 sm:mb-12 text-center">
          <h2 className="text-lg sm:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 bg-clip-text text-transparent animate-gradient">
            Personalize Your Journey
          </h2>
          <p className="text-xs sm:text-xl text-gray-600 dark:text-gray-300 font-light">
            Let's craft the perfect health plan for you!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Name Input */}
          <div className="relative group">
            <div
              className={`absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 rounded-xl sm:rounded-2xl blur transition-all duration-500 ${
                focusedInput === "name" ? "opacity-100" : "opacity-0"
              }`}
            />
            <div className="relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl">
              <div className="flex items-center space-x-3 sm:space-x-4 bg-gray-50 dark:bg-gray-900 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-4 sm:py-5">
                <User className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400 dark:text-gray-300" />
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedInput("name")}
                  onBlur={() => setFocusedInput("")}
                  className="block w-full outline-none bg-transparent text-[11px] sm:text-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-0"
                  required
                />
              </div>
            </div>
          </div>

          {/* Gender Input */}
          <div className="relative group">
            <div
              className={`absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 rounded-xl sm:rounded-2xl blur transition-all duration-500 ${
                focusedInput === "gender" ? "opacity-100" : "opacity-0"
              }`}
            />
            <div className="relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl">
              <div className="flex items-center space-x-3 sm:space-x-4 bg-gray-50 dark:bg-gray-900 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-4 sm:py-5">
                <User className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400 dark:text-gray-300" />
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  onFocus={() => setFocusedInput("gender")}
                  onBlur={() => setFocusedInput("")}
                  className="block w-full outline-none bg-transparent text-[11px] sm:text-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-0"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Age Input */}
          <div className="relative group">
            <div
              className={`absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 rounded-xl sm:rounded-2xl blur transition-all duration-500 ${
                focusedInput === "age" ? "opacity-100" : "opacity-0"
              }`}
            />
            <div className="relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl">
              <div className="flex items-center space-x-3 sm:space-x-4 bg-gray-50 dark:bg-gray-900 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-4 sm:py-5">
                <Calendar className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400 dark:text-gray-300" />
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleChange}
                  onFocus={() => setFocusedInput("age")}
                  onBlur={() => setFocusedInput("")}
                  className="block w-full outline-none bg-transparent text-[11px] sm:text-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-0"
                  required
                />
              </div>
            </div>
          </div>

          {/* Weight Input */}
          <div className="relative group">
            <div
              className={`absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 rounded-xl sm:rounded-2xl blur transition-all duration-500 ${
                focusedInput === "weight" ? "opacity-100" : "opacity-0"
              }`}
            />
            <div className="relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl">
              <div className="flex items-center space-x-3 sm:space-x-4 bg-gray-50 dark:bg-gray-900 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-4 sm:py-5">
                <Scale className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400 dark:text-gray-300" />
                <input
                  type="number"
                  name="weight"
                  placeholder="Weight (kg)"
                  value={formData.weight}
                  onChange={handleChange}
                  onFocus={() => setFocusedInput("weight")}
                  onBlur={() => setFocusedInput("")}
                  className="block w-full outline-none bg-transparent text-[11px] sm:text-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-0"
                  required
                />
              </div>
            </div>
          </div>

          {/* Height Inputs */}
          <div className="flex flex-col sm:flex-row gap-4">
            {["heightFt", "heightIn"].map((heightType) => (
              <div className="relative group flex-1" key={heightType}>
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 rounded-xl sm:rounded-2xl blur transition-all duration-500 ${
                    focusedInput === heightType ? "opacity-100" : "opacity-0"
                  }`}
                />
                <div className="relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl">
                  <div className="flex items-center space-x-3 sm:space-x-4 bg-gray-50 dark:bg-gray-900 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-4 sm:py-5">
                    <Ruler className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400 dark:text-gray-300" />
                    <input
                      type="number"
                      name={heightType}
                      placeholder={
                        heightType === "heightFt"
                          ? "Height (ft)"
                          : "Height (in)"
                      }
                      value={formData[heightType]}
                      onChange={handleChange}
                      onFocus={() => setFocusedInput(heightType)}
                      onBlur={() => setFocusedInput("")}
                      className="block w-full outline-none bg-transparent text-[11px] sm:text-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-0"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Activity Level Input */}
          <div className="relative group">
            <div
              className={`absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 rounded-xl sm:rounded-2xl blur transition-all duration-500 ${
                focusedInput === "activityLevel" ? "opacity-100" : "opacity-0"
              }`}
            />
            <div className="relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl">
              <div className="flex items-center space-x-3 sm:space-x-4 bg-gray-50 dark:bg-gray-900 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-4 sm:py-5">
                <Activity className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400 dark:text-gray-300" />
                <select
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleChange}
                  onFocus={() => setFocusedInput("activityLevel")}
                  onBlur={() => setFocusedInput("")}
                  className="block w-full outline-none bg-transparent text-[11px] sm:text-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-0 font-emoji"
                  required
                >
                  <option value="">Select Activity Level</option>
                  {activityLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.icon} {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-100/10 rounded-xl p-3 sm:p-4 flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="relative w-full group overflow-hidden rounded-xl text-sm sm:text-lg font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 group-hover:opacity-90 transition-opacity" />
            <div className="relative flex items-center justify-center backdrop-blur-sm px-3 sm:px-6 py-2 sm:py-4 text-white">
              {loading && (
                <div className="animate-spin w-4 h-4 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full mr-2 sm:mr-3" />
              )}
              <span>
                {loading ? "Submitting..." : "Continue to FitBites AI"}
              </span>
            </div>
          </button>
        </form>
      </div>
    </div>
  );
};

export default WelcomeForm;
