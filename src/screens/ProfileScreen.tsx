import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import dayjs from "dayjs";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { fetchMyPosts } from "../services/postService";
import { Post, Profile } from "../types";
import { useThemeColors } from "../hooks/useThemeColor";

async function deletePost(postId: string, userId: string) {
  try {
    // fetch image URL first
    const { data: post } = await supabase
      .from("posts")
      .select("image_url")
      .eq("id", postId)
      .single();

    // delete post record
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId)
      .eq("user_id", userId);

    if (error) throw error;

    // if there's an image, delete from storage
    if (post?.image_url) {
      const path = post.image_url.split("/storage/v1/object/public/images/")[1];
      await supabase.storage.from("images").remove([path]);
    }

    return true;
  } catch (err) {
    console.error("❌ Delete error:", err);
    throw err;
  }
}

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const colors = useThemeColors();


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
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
        }}
      >
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={{ marginTop: 12, fontSize: 15, color: "#6b7280" }}>
          Loading profile...
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      style={{ flex: 1, backgroundColor: "#f9fafb" }}
      ListHeaderComponent={
        <View>
          {/* Profile Header Section */}
          <View
            style={{
              backgroundColor: "#FFFFFF",
              paddingTop: 60,
              paddingBottom: 32,
              paddingHorizontal: 24,
              borderBottomWidth: 1,
              borderBottomColor: "#e5e7eb",
            }}
          >
            {/* Header with Avatar and Info */}
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 24 }}>
              {/* Smaller Avatar */}
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: "#7c3aed",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 16,
                }}
              >
                <Text
                  style={{ fontSize: 22, fontWeight: "700", color: "#FFFFFF" }}
                >
                  {profile?.full_name?.charAt(0).toUpperCase() || "U"}
                </Text>
              </View>

              {/* Profile Info */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "700",
                    color: "#1a1a1a",
                    marginBottom: 4,
                  }}
                >
                  {profile?.full_name || "User"}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#6b7280",
                  }}
                >
                  {profile?.email}
                </Text>
              </View>
            </View>

            {/* Stats Row */}
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#f9fafb",
                borderRadius: 12,
                padding: 20,
                marginBottom: 20,
                borderWidth: 1,
                borderColor: "#e5e7eb",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "700",
                    color: "#1a1a1a",
                    marginBottom: 4,
                  }}
                >
                  {posts.length}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: "#6b7280",
                    fontWeight: "500",
                  }}
                >
                  Total Posts
                </Text>
              </View>
              
              <View style={{ width: 1, backgroundColor: "#e5e7eb", marginHorizontal: 20 }} />
              
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "700",
                    color: "#1a1a1a",
                    marginBottom: 4,
                  }}
                >
                  {dayjs(profile?.created_at).format("MMM 'YY")}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: "#6b7280",
                    fontWeight: "500",
                  }}
                >
                  Member Since
                </Text>
              </View>
            </View>

            {/* Logout Button */}
            <TouchableOpacity
              onPress={signOut}
              style={{
                borderWidth: 1.5,
                borderColor: "#e5e7eb",
                padding: 16,
                borderRadius: 12,
                backgroundColor: "#FFFFFF",
              }}
              activeOpacity={0.7}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#6b7280",
                  fontWeight: "600",
                  fontSize: 15,
                }}
              >
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>

          {/* My Posts Section Header */}
          <View
            style={{
              paddingHorizontal: 24,
              paddingTop: 32,
              paddingBottom: 16,
              backgroundColor: "#f9fafb",
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "700", color: "#1a1a1a", marginBottom: 4 }}>
              My Posts
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#6b7280",
              }}
            >
              {posts.length === 0
                ? "No posts yet"
                : `${posts.length} ${posts.length === 1 ? "post" : "posts"} published`}
            </Text>
          </View>
        </View>
      }
      contentContainerStyle={{ paddingBottom: 32 }}
      renderItem={({ item }) => (
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            marginHorizontal: 16,
            marginBottom: 16,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          {/* Post Header */}
          <View
            style={{
              padding: 16,
              borderBottomWidth: item.content || item.image_url ? 1 : 0,
              borderBottomColor: "#f3f4f6",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 13, color: "#9ca3af", fontWeight: "500" }}>
              {dayjs(item.created_at).format("MMM D, YYYY")}
            </Text>

            {/* Delete Button */}
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "Delete Post",
                  "Are you sure you want to delete this post? This action cannot be undone.",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: async () => {
                        try {
                          if (!user?.id) return;
                          await deletePost(item.id, user.id);

                          setPosts((prev) =>
                            prev.filter((p) => p.id !== item.id)
                          );
                          Alert.alert("Success", "Post deleted successfully");
                        } catch (err: any) {
                          Alert.alert(
                            "Error",
                            err.message || "Could not delete post."
                          );
                        }
                      },
                    },
                  ]
                );
              }}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#fecaca",
                backgroundColor: "#fef2f2",
              }}
              activeOpacity={0.7}
            >
              <Text
                style={{
                  color: "#dc2626",
                  fontWeight: "600",
                  fontSize: 13,
                }}
              >
                Delete
              </Text>
            </TouchableOpacity>
          </View>

          {/* Post Content */}
          {item.content ? (
            <View
              style={{
                paddingHorizontal: 16,
                paddingTop: 16,
                paddingBottom: item.image_url ? 12 : 16,
              }}
            >
              <Text style={{ fontSize: 15, color: "#1a1a1a", lineHeight: 22 }}>
                {item.content}
              </Text>
            </View>
          ) : null}

          {/* Post Image */}
          {item.image_url ? (
            <Image
              source={{ uri: item.image_url }}
              style={{
                width: "100%",
                height: 300,
                backgroundColor: "#f3f4f6",
              }}
              resizeMode="cover"
            />
          ) : null}
        </View>
      )}
      ListEmptyComponent={
        <View
          style={{
            alignItems: "center",
            paddingVertical: 64,
            paddingHorizontal: 24,
          }}
        >
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: "#f3f4f6",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 36 }}>📝</Text>
          </View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#1a1a1a",
              marginBottom: 8,
            }}
          >
            No posts yet
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: "#6b7280",
              textAlign: "center",
              lineHeight: 22,
            }}
          >
            Share your first moment with the community
          </Text>
        </View>
      }
    />
  );
}