"use client";

import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";
import ThemeProvider from "@/utils/ui/ThemeProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#333",
                color: "#fff",
              },
              success: {
                duration: 3000,
                theme: {
                  primary: "#4aed88",
                },
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
