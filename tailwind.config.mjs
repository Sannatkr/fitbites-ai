/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        slide: {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(100%)" },
          shine: {
            to: {
              "background-position": "200% center",
            },
          },
          wiggle: {
            "0%, 100%": { transform: "rotate(-3deg)" },
            "50%": { transform: "rotate(3deg)" },
          },
        },
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        slide: "slide 3s linear infinite",
        gradient: "gradient 3s linear infinite",
        shine: "shine 4s ease-in-out infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
