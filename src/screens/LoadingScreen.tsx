import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useTheme } from "../context/ThemeContext"; // uses your global theme

export default function LoadingScreen() {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 36,
          fontWeight: "800",
          color: colors.tint,
          letterSpacing: 1,
          marginBottom: 16,
        }}
      >
        Framez
      </Text>

      <ActivityIndicator size="large" color={colors.tint} />
    </View>
  );
}
