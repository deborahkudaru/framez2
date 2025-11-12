// src/theme/theme.ts
export const light = {
  background: "#f9fafb",
  card: "#FFFFFF",
  text: "#111827",
  subtext: "#6b7280",
  border: "#e5e7eb",
  tint: "#7c3aed",
  statusBarStyle: "dark-content" as const,
};

export const dark = {
  background: "#000000",
  card: "#111827",
  text: "#f9fafb",
  subtext: "#9ca3af",
  border: "#27272a",
  tint: "#7c3aed",
  statusBarStyle: "light-content" as const,
};

export type ThemeColors = typeof light;
