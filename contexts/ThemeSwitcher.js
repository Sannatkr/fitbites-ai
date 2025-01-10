import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeSwitcher = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 animate-in"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {!isDark ? (
        <Moon className="w-5 h-5 text-gray-600 animate-rotate-up" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-500 animate-rotate-up" />
      )}
    </button>
  );
};

const keyframes = {
  "rotate-up": {
    from: { transform: "rotate(-30deg)" },
    to: { transform: "rotate(0deg)" },
  },
};

const animation = {
  "rotate-up": "rotate-up 0.3s ease-out",
};

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes rotate-up {
      from {
        transform: rotate(-30deg);
        opacity: 0;
      }
      to {
        transform: rotate(0deg);
        opacity: 1;
      }
    }
    .animate-rotate-up {
      animation: rotate-up 0.3s ease-out;
    }
  `;
  document.head.appendChild(style);
}

export default ThemeSwitcher;
