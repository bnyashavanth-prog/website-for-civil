"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeContextType = {
  theme: "dark" | "light";
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("ss-build-theme") as "dark" | "light";
    if (savedTheme === "light") {
      setTheme("light");
      document.documentElement.classList.add("theme-light");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
      document.documentElement.classList.add("theme-light");
      localStorage.setItem("ss-build-theme", "light");
    } else {
      setTheme("dark");
      document.documentElement.classList.remove("theme-light");
      localStorage.setItem("ss-build-theme", "dark");
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
