import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface DarkModeContextType {
  isDark: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (dark: boolean) => void;
}

const DarkModeContext = createContext<DarkModeContextType | null>(null);

export function DarkModeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(() => {
    // Default = Dark Mode
    const stored = localStorage.getItem("dark-mode");

    if (stored !== null) {
      return stored === "true";
    }

    return true;
  });

  useEffect(() => {
    localStorage.setItem("dark-mode", String(isDark));

    if (isDark) {
      document.documentElement.classList.add("dark");
      document.body.style.backgroundColor = "#020617";
    } else {
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = "#f8fafc";
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark((prev) => !prev);
  };

  const setDarkMode = (dark: boolean) => {
    setIsDark(dark);
  };

  return (
    <DarkModeContext.Provider
      value={{
        isDark,
        toggleDarkMode,
        setDarkMode,
      }}
    >
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  const context = useContext(DarkModeContext);

  if (!context) {
    throw new Error(
      "useDarkMode must be used within DarkModeProvider"
    );
  }

  return context;
}