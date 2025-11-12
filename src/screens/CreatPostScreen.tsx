import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../context/AuthContext";
import { createPost } from "../services/postService";
import { uploadImageAsync } from "../utils/upload";
import { supabase } from "../lib/supabase";
import { useTheme } from "../context/ThemeContext"; // 💜 use global theme

export default function CreatePostScreen() {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme(); // 💜 theme hook

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow photo library access to upload images.",
        [{ text: "OK", style: "default" }]
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setImageUri(null);
  };

  const onPost = async () => {
    if (!user) {
      Alert.alert("Not Logged In", "Please log in to create a post.");
      return;
    }

    if (!content.trim() && !imageUri) {
      Alert.alert("Empty Post", "Please add some content or an image.");
      return;
    }

    setLoading(true);

    try {
      const { data: authData } = await supabase.auth.getUser();
      const loggedInUser = authData?.user;

      if (!loggedInUser) {
        throw new Error("No authenticated user found");
      }

      let imageUrl: string | null = null;
      if (imageUri) {
        imageUrl = await uploadImageAsync(imageUri, "posts", loggedInUser.id);
      }

      const result = await createPost(
        loggedInUser.id,
        content.trim() || null,
        imageUrl
      );
      console.log("✅ Insert result:", result);

      setContent("");
      setImageUri(null);
      Alert.alert("Success", "Your post has been published!");
    } catch (e: any) {
      Alert.alert(
        "Error",
        e.message || "Could not create post. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 24,
          paddingTop: 60,
          paddingBottom: 24,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          backgroundColor: colors.card,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
            color: colors.text,
          }}
        >
          Create Post
        </Text>
        <Text style={{ fontSize: 14, color: colors.subtext, marginTop: 4 }}>
          Share your moment with the community
        </Text>
      </View>

      {/* Main Content */}
      <View style={{ paddingHorizontal: 24, paddingTop: 32, gap: 24 }}>
        {/* Text Input */}
        <View>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: colors.text,
              marginBottom: 10,
            }}
          >
            What's on your mind?
          </Text>
          <TextInput
            placeholder="Share your thoughts..."
            placeholderTextColor={colors.subtext}
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
            style={{
              borderWidth: 1.5,
              borderColor: colors.border,
              borderRadius: 12,
              padding: 16,
              minHeight: 160,
              fontSize: 15,
              color: colors.text,
              backgroundColor: colors.card,
            }}
          />
          <Text style={{ fontSize: 12, color: colors.subtext, marginTop: 8 }}>
            {content.length} characters
          </Text>
        </View>

        {/* Image Preview */}
        {imageUri ? (
          <View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: colors.text,
                marginBottom: 10,
              }}
            >
              Image Preview
            </Text>
            <View
              style={{
                borderRadius: 12,
                overflow: "hidden",
                borderWidth: 1.5,
                borderColor: colors.border,
              }}
            >
              <Image
                source={{ uri: imageUri }}
                style={{
                  width: "100%",
                  height: 300,
                  backgroundColor: colors.border,
                }}
                resizeMode="cover"
              />
              {/* Remove Image Button */}
              <TouchableOpacity
                onPress={removeImage}
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  backgroundColor: "rgba(0,0,0,0.7)",
                  borderRadius: 20,
                  width: 36,
                  height: 36,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                activeOpacity={0.8}
              >
                <Text
                  style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "600" }}
                >
                  ×
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {/* Add Image Button */}
        <TouchableOpacity
          onPress={pickImage}
          style={{
            padding: 16,
            borderWidth: 1.5,
            borderColor: colors.tint,
            borderRadius: 12,
            backgroundColor: isDark(colors)
              ? "rgba(124,58,237,0.1)"
              : "#faf5ff",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
          activeOpacity={0.7}
        >
          <Text style={{ fontSize: 20 }}>📷</Text>
          <Text
            style={{
              textAlign: "center",
              color: colors.tint,
              fontWeight: "600",
              fontSize: 15,
            }}
          >
            {imageUri ? "Change Image" : "Add Image"}
          </Text>
        </TouchableOpacity>

        {/* Post Button */}
        <TouchableOpacity
          onPress={onPost}
          disabled={loading || (!content.trim() && !imageUri)}
          style={{
            padding: 18,
            backgroundColor: colors.tint,
            borderRadius: 12,
            marginTop: 12,
            shadowColor: colors.tint,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: loading ? 0 : 0.3,
            shadowRadius: 8,
            elevation: loading ? 0 : 4,
            opacity: loading || (!content.trim() && !imageUri) ? 0.6 : 1,
          }}
          activeOpacity={0.85}
        >
          {loading ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text
                style={{
                  color: "#FFFFFF",
                  textAlign: "center",
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                Publishing...
              </Text>
            </View>
          ) : (
            <Text
              style={{
                color: "#FFFFFF",
                textAlign: "center",
                fontSize: 16,
                fontWeight: "600",
                letterSpacing: 0.3,
              }}
            >
              Publish Post
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// helper to check dark mode (optional)
const isDark = (colors: any) => colors.background === "#000";
