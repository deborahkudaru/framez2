import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTheme } from "../../context/ThemeContext"; // global theme

export default function LoginScreen({
  navigation,
}: NativeStackScreenProps<any>) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme(); // theme colors

  const onLogin = async () => {
    setLoading(true);
    setErr(null);
    const { error } = await signIn(email.trim(), password);
    if (error) {
      setErr(typeof error === "string" ? error : "Invalid credentials");
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{
          flex: 1,
          padding: 24,
          justifyContent: "center",
          maxWidth: 440,
          width: "100%",
          alignSelf: "center",
        }}
      >
        {/* Header */}
        <View style={{ marginBottom: 40, alignItems: "center" }}>
          <Text
            style={{
              fontSize: 32,
              fontWeight: "700",
              color: colors.text,
              marginBottom: 8,
            }}
          >
            Welcome Back
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: colors.subtext,
              textAlign: "center",
            }}
          >
            Sign in to continue to your account
          </Text>
        </View>

        {/* Form */}
        <View style={{ gap: 20 }}>
          {/* Email Input */}
          <View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: colors.text,
                marginBottom: 8,
              }}
            >
              Email Address
            </Text>
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor={colors.subtext}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              style={{
                borderWidth: 1.5,
                borderColor: colors.border,
                padding: 14,
                borderRadius: 12,
                fontSize: 15,
                color: colors.text,
                backgroundColor: colors.card,
              }}
            />
          </View>

          {/* Password Input */}
          <View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: colors.text,
                marginBottom: 8,
              }}
            >
              Password
            </Text>
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor={colors.subtext}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={{
                borderWidth: 1.5,
                borderColor: colors.border,
                padding: 14,
                borderRadius: 12,
                fontSize: 15,
                color: colors.text,
                backgroundColor: colors.card,
              }}
            />
          </View>

          {/* Error Message */}
          {err ? (
            <View
              style={{
                backgroundColor: "#fef2f2",
                padding: 12,
                borderRadius: 8,
                borderLeftWidth: 3,
                borderLeftColor: "#dc2626",
              }}
            >
              <Text style={{ color: "#dc2626", fontSize: 14 }}>{err}</Text>
            </View>
          ) : null}

          {/* Login Button */}
          <TouchableOpacity
            onPress={onLogin}
            disabled={loading}
            style={{
              padding: 16,
              backgroundColor: colors.tint,
              borderRadius: 12,
              marginTop: 8,
              shadowColor: colors.tint,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
              opacity: loading ? 0.6 : 1,
            }}
            activeOpacity={0.85}
          >
            <Text
              style={{
                color: "#FFFFFF",
                textAlign: "center",
                fontSize: 16,
                fontWeight: "600",
                letterSpacing: 0.3,
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Text>
          </TouchableOpacity>

          {/* Register Link */}
          <View style={{ marginTop: 16, alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 15, color: colors.subtext }}>
                Don’t have an account?{" "}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Register")}
                activeOpacity={0.7}
              >
                <Text
                  style={{
                    fontSize: 15,
                    color: colors.tint,
                    fontWeight: "600",
                  }}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
