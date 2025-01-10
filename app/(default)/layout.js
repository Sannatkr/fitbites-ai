// app/(default)/layout.js
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ThemeProvider from "../../utils/ui/ThemeProvider"; // Adjust path if needed
import "@/styles/globals.css"; // Import global styles here

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
