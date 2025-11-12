import { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'framez',
  slug: 'framez',
  scheme: 'framez',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  ios: { supportsTablet: true },
 android: {
  package: "com.deborahkudaru.framez", 
  adaptiveIcon: {
    foregroundImage: "./assets/adaptive-icon.png",
    backgroundColor: "#ffffff",
  },
  edgeToEdgeEnabled: true,
  predictiveBackGestureEnabled: false,
},

  web: { favicon: './assets/favicon.png' },
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  extra: {
    EXPO_PUBLIC_SUPABASE_URL: 'https://apivuzwimddkuzckpigw.supabase.co',
    EXPO_PUBLIC_SUPABASE_ANON_KEY:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwaXZ1endpbWRka3V6Y2twaWd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4ODU2MTksImV4cCI6MjA3ODQ2MTYxOX0.j-oQPAw-9E-Z4fzTUBxlIqXbOvKp1kkZopjmuWWsqgg',
    eas: {
      projectId: '1dd4f50d-c562-4fd7-958f-2694719482a2',
    },
  },
   plugins: ["expo-font"],
};

export default config;
