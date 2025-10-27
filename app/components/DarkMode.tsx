"use client";

import { Switch, useTheme } from "@abhishekbarve/components";
import { useEffect, useState } from "react";

function DarkMode() {
  const { theme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      const isDarkMode = storedTheme === "dark";

      setIsDark(isDarkMode);
      document.documentElement.classList.toggle("dark", isDarkMode);
      setTheme(isDarkMode ? "dark" : "light");

      if (!storedTheme) {
        localStorage.setItem("theme", "light");
      }
    }
  }, [setTheme]);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);

    if (typeof window !== "undefined") {
      const newTheme = newIsDark ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      document.documentElement.classList.toggle("dark", newIsDark);
      setTheme(newTheme);
    }
  };

  return <Switch checked={isDark} onCheckedChange={toggleTheme} />;
}

export default DarkMode;
