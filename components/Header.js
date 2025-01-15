"use client";
import Link from "next/link";
import ThemeSwitcher from "../contexts/ThemeSwitcher.js";
// import { Moon, Sun } from "lucide-react";

export default function Header() {
  //   const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-transparent fixed top-0 left-0 w-full z-10 shadow-md backdrop-blur-lg rounded-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent"
        >
          FitBites AI
        </Link>

        <nav>
          <ul className="flex space-x-4">
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
            <li>
              <Link
                href="/contact"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
        <ThemeSwitcher />
      </div>
    </header>
  );
}
