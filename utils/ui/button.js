import React from "react";

export function Button({ children, size = "md", ...props }) {
  const sizeClasses = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors ${sizeClasses[size]}`}
      {...props}
    >
      {children}
    </button>
  );
}
