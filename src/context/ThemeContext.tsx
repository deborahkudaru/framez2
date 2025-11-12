// src/context/ThemeContext.tsx
import React, { createContext, useContext, useMemo } from "react";
import { useColorScheme, StatusBar } from "react-native";

type ThemeColors = {
  background: string;
  card: string;
  text: string;
  subtext: string;
  border: string;
  tint: string;
  statusBarStyle: "light-content" | "dark-content";
};

type ThemeContextType = {
  colors: ThemeColors;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
  colors: {
    background: "#fff",
    card: "#fff",
    text: "#000",
    subtext: "#666",
    border: "#e5e7eb",
    tint: "#7c3aed",
    statusBarStyle: "dark-content",
  },
  isDark: false,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const colors = useMemo<ThemeColors>(
    () =>
      isDark
        ? {
            background: "#000",
            card: "#111827",
            text: "#f9fafb",
            subtext: "#9ca3af",
            border: "#1f2937",
            tint: "#7c3aed",
            statusBarStyle: "light-content",
          }
        : {
            background: "#f9fafb",
            card: "#ffffff",
            text: "#1a1a1a",
            subtext: "#6b7280",
            border: "#e5e7eb",
            tint: "#7c3aed",
            statusBarStyle: "dark-content",
          },
    [isDark]
  );

  return (
    <ThemeContext.Provider value={{ colors, isDark }}>
      <StatusBar
        translucent
        backgroundColor={colors.card}
        barStyle={colors.statusBarStyle}
      />
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
