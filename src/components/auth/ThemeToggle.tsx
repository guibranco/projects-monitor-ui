import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

export function ThemeToggle(): React.JSX.Element {
  const { isDarkMode, setIsDarkMode } = useTheme();

  return (
    <button
      onClick={() => setIsDarkMode(!isDarkMode)}
      className="absolute top-4 right-4 flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle light and dark theme"
    >
      {isDarkMode ? (
        <>
          <Sun className="w-4 h-4" />
          <span>Light mode</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4" />
          <span>Dark mode</span>
        </>
      )}
    </button>
  );
}
