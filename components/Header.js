"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import ThemeSwitcher from "../contexts/ThemeSwitcher.js";
import { LogOut, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

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

  const navLinks = [
    { href: "/", text: "Home" },
    { href: "/about", text: "About Us" },
    { href: "/features", text: "Features" },
  ];

  return (
    <header className="bg-transparent w-full z-20 fixed top-0 left-0 shadow-md backdrop-blur-lg rounded-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Left Side: Logo */}
        <Link
          href="/"
          className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent"
        >
          FitBites AI
        </Link>

        {/* Center: Navigation Links (Desktop) */}
        <nav className="hidden md:flex flex-1 justify-center">
          <ul className="flex space-x-6 font-semibold text-lg">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right Side: Theme Switcher, Logout, and Mobile Menu Button */}
        <div className="flex items-center space-x-2">
          <div className="dark:hover:bg-gray-700 hover:bg-gray-200 p-1 rounded-lg transition-colors">
            <ThemeSwitcher />
          </div>

          {pathname.startsWith("/dashboard") && (
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors md:px-4 md:py-2 md:bg-gradient-to-r md:from-blue-600 md:via-purple-500 md:to-pink-500 md:text-white md:hover:from-blue-700 md:hover:to-pink-600"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Logout</span>
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors md:hidden"
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 180, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -180, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu with Animation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-white dark:bg-gray-800 overflow-hidden"
          >
            <motion.nav
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              exit={{ y: -20 }}
              className="container mx-auto px-4 py-2"
            >
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <motion.li
                    key={link.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-semibold"
                    >
                      {link.text}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
