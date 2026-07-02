import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const STORAGE_KEY = "darkMode";

interface ThemeContextValue {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function readStoredTheme(): boolean {
  if (typeof window === "undefined") {
    return true;
  }
  const storedTheme = localStorage.getItem(STORAGE_KEY);
  return storedTheme === null ? true : storedTheme === "true";
}

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [isDarkMode, setIsDarkMode] = useState(readStoredTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem(STORAGE_KEY, isDarkMode.toString());
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
