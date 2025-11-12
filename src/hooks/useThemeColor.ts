import { useColorScheme } from "react-native";

export function useThemeColors() {
  const scheme = useColorScheme();

  const isDark = scheme === "dark";

  return {
    background: isDark ? "#000" : "#fff",
    text: isDark ? "#f9fafb" : "#111",
    secondaryText: isDark ? "#9ca3af" : "#6b7280",
    card: isDark ? "#111827" : "#f9fafb",
    border: isDark ? "#1f2937" : "#e5e7eb",
    isDark,
  };
}
