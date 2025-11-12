import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../context/AuthContext";
import { createPost } from "../services/postService";
import { uploadImageAsync } from "../utils/upload";
import { supabase } from "../lib/supabase";

export default function CreatePostScreen() {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Allow photo library access to upload images."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const onPost = async () => {
    if (!user) {
      Alert.alert("Not logged in", "Please log in again.");
      return;
    }

    setLoading(true);

    try {
      // get the currently authenticated user from supabase directly
      const { data: authData } = await supabase.auth.getUser();
      const loggedInUser = authData?.user;

      console.log("👤 Logged-in user:", loggedInUser?.id);

      if (!loggedInUser) {
        throw new Error("No authenticated user found");
      }

      let imageUrl: string | null = null;

      if (imageUri) {
        imageUrl = await uploadImageAsync(imageUri, "posts", loggedInUser.id);
      }

      const { data: authCheck } = await supabase.auth.getUser();
      console.log("👤 Current user before insert:", authCheck?.user?.id);

      const result = await createPost(
        loggedInUser.id,
        content.trim() || null,
        imageUrl
      );
      console.log("✅ Insert result:", result);

      setContent("");
      setImageUri(null);
      Alert.alert("Posted", "Your post is live.");
    } catch (e: any) {
      Alert.alert("Error", e.message || "Could not create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <TextInput
        placeholder="What's on your mind?"
        value={content}
        onChangeText={setContent}
        multiline
        style={{ borderWidth: 1, borderRadius: 8, padding: 12, minHeight: 100 }}
      />

      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={{ width: "100%", height: 300, borderRadius: 8 }}
        />
      ) : null}

      <TouchableOpacity
        onPress={pickImage}
        style={{ padding: 14, borderWidth: 1, borderRadius: 8 }}
      >
        <Text style={{ textAlign: "center" }}>
          {imageUri ? "Change image" : "Add image"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onPost}
        disabled={loading}
        style={{ padding: 14, backgroundColor: "#222", borderRadius: 8 }}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>
          {loading ? "..." : "Post"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
