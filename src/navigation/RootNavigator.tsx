import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  View,
  Text,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import FeedScreen from "../screens/FeedScreen";
import CreatePostScreen from "../screens/CreatPostScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext"; // 👈 use your theme context

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function AppTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#7c3aed",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: -2,
          marginBottom: Platform.OS === "ios" ? 0 : 8,
        },
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#e5e7eb",
          height: Platform.OS === "ios" ? 85 : 70,
          paddingTop: 8,
          paddingBottom: Platform.OS === "ios" ? 20 : 12,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home-outline";
          let iconSize = size;

          if (route.name === "Feed") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Create") {
            iconName = focused ? "add-circle" : "add-circle-outline";
            iconSize = size + 8;
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          if (route.name === "Create") {
            return (
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: focused ? "#7c3aed" : "#f3f4f6",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: -20,
                  shadowColor: focused ? "#7c3aed" : "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: focused ? 0.3 : 0.1,
                  shadowRadius: 8,
                  elevation: 5,
                }}
              >
                <Ionicons
                  name={iconName}
                  size={32}
                  color={focused ? "#FFFFFF" : "#6b7280"}
                />
              </View>
            );
          }

          return <Ionicons name={iconName} size={iconSize} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="Feed" component={FeedScreen} options={{ tabBarLabel: "Home" }} />
      <Tabs.Screen name="Create" component={CreatePostScreen} options={{ tabBarLabel: "Create" }} />
      <Tabs.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: "Profile" }} />
    </Tabs.Navigator>
  );
}

export default function RootNavigator() {
  const { user, loading } = useAuth();
  const { colors } = useTheme();

  // 💜 Splash screen while app/auth is loading
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <Text
          style={{
            fontSize: 40,
            fontWeight: "800",
            color: colors.tint, // purple
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

  return (
    <NavigationContainer>
      {user ? (
        <AppTabs />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
