import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator } from "react-native";
import dayjs from "dayjs";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { fetchMyPosts } from "../services/postService";
import { Post, Profile } from "../types";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProfileAndPosts = async () => {
    if (!user) return;
    try {
      setLoading(true);
      // get profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(profileData);

      // get user's posts
      const userPosts = await fetchMyPosts(user.id);
      setPosts(userPosts);
    } catch (e) {
      console.error("❌ error loading profile:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileAndPosts();
  }, [user?.id]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 22, fontWeight: "700" }}>My Profile</Text>
          <Text style={{ marginTop: 8 }}>{profile?.full_name}</Text>
          <Text style={{ color: "#555" }}>{profile?.email}</Text>

          <TouchableOpacity
            onPress={signOut}
            style={{
              marginTop: 10,
              borderWidth: 1,
              padding: 10,
              borderRadius: 8,
              alignSelf: "flex-start",
            }}
          >
            <Text>Logout</Text>
          </TouchableOpacity>

          <Text style={{ marginTop: 20, fontSize: 18, fontWeight: "600" }}>
            My Posts
          </Text>
        </View>
      }
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
      renderItem={({ item }) => (
        <View
          style={{
            borderWidth: 1,
            borderRadius: 10,
            marginBottom: 14,
            padding: 10,
          }}
        >
          <Text style={{ color: "#666", marginBottom: 4 }}>
            {dayjs(item.created_at).format("MMM D, YYYY h:mm A")}
          </Text>
          {item.content ? (
            <Text style={{ marginBottom: 6 }}>{item.content}</Text>
          ) : null}
          {item.image_url ? (
            <Image
              source={{ uri: item.image_url }}
              style={{ width: "100%", height: 250, borderRadius: 8 }}
            />
          ) : null}
        </View>
      )}
    />
  );
}
