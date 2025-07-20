"use client";

import { useTheme } from "@/lib/theme-context";
import { useState, useEffect } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="group relative inline-flex h-6 w-12 items-center justify-center rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-md transition-all duration-500 ease-out hover:shadow-lg">
        <div className="relative flex h-5 w-11 items-center justify-between rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-1 transition-all duration-500 ease-out">
          <div className="h-3 w-3 text-gray-400 transition-all duration-300">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-sm">
              <circle cx="12" cy="12" r="4"/>
              <path d="m12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 6.34l-1.41 1.41m11.32-1.41-1.41 1.41"/>
            </svg>
          </div>
          <div className="h-3 w-3 text-gray-400 transition-all duration-300">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-sm">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
            </svg>
          </div>
        </div>
        <div className="absolute left-0.5 h-5 w-5 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-md transition-all duration-500 ease-out" />
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="group relative inline-flex h-6 w-12 items-center justify-center rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-md transition-all duration-500 ease-out hover:shadow-lg hover:scale-110 active:scale-95"
      aria-label="Toggle theme"
    >
      <div className="relative flex h-5 w-11 items-center justify-between rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-1 transition-all duration-500 ease-out">
        {/* Sun icon */}
        <div className={`h-3 w-3 transition-all duration-500 ease-out ${
          theme === "light" 
            ? "text-yellow-400 scale-110 drop-shadow-lg" 
            : "text-gray-400 scale-90 drop-shadow-sm"
        }`}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <circle cx="12" cy="12" r="4"/>
            <path d="m12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 6.34l-1.41 1.41m11.32-1.41-1.41 1.41"/>
          </svg>
        </div>
        {/* Moon icon */}
        <div className={`h-3 w-3 transition-all duration-500 ease-out ${
          theme === "dark" 
            ? "text-blue-400 scale-110 drop-shadow-lg" 
            : "text-gray-400 scale-90 drop-shadow-sm"
        }`}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
          </svg>
        </div>
      </div>
      <div 
        className={`absolute left-0.5 h-5 w-5 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-300 dark:from-blue-400 dark:to-blue-600 shadow-md transition-all duration-500 ease-out ${
          theme === "dark" ? "translate-x-6 rotate-180" : "translate-x-0 rotate-0"
        }`}
      />
      {/* Glow effect */}
      <div 
        className={`absolute inset-0 rounded-full transition-all duration-500 ease-out ${
          theme === "light" 
            ? "bg-yellow-400/20 blur-lg" 
            : "bg-blue-400/20 blur-lg"
        } ${theme === "dark" ? "translate-x-6" : "translate-x-0"}`}
      />
    </button>
  );
} 