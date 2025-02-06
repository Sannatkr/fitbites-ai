"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import ThemeSwitcher from "../contexts/ThemeSwitcher.js";
import { LogOut } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname(); // Add this to get current path

  const handleLogout = async () => {
    try {
      Cookies.remove("token");
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      router.push("/");
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
      router.push("/");
      window.location.reload();
    }
  };

  return (
    <header className="bg-transparent fixed top-0 left-0 w-full z-20 shadow-md backdrop-blur-lg rounded-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Left Side: Logo */}
        <Link
          href="/"
          className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent"
        >
          FitBites AI
        </Link>

        {/* Center: Navigation Links */}
        <nav className="flex-1 flex justify-center">
          <ul className="flex space-x-6 font-semibold text-lg">
            <li>
              <Link
                href="/"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/features"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Features
              </Link>
            </li>
          </ul>
        </nav>

        {/* Right Side: Theme Switcher and Conditional Logout Button */}
        <div className="flex items-center space-x-4">
          <ThemeSwitcher />
          {pathname.startsWith("/dashboard") && (
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-white hover:from-blue-700 hover:to-pink-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
