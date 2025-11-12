import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import dayjs from "dayjs";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { fetchMyPosts } from "../services/postService";
import { Post, Profile } from "../types";
import { useTheme } from "../context/ThemeContext";
import { useFocusEffect } from "@react-navigation/native"; 

async function deletePost(postId: string, userId: string) {
  try {
    const { data: post } = await supabase
      .from("posts")
      .select("image_url")
      .eq("id", postId)
      .single();

    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId)
      .eq("user_id", userId);

    if (error) throw error;

    if (post?.image_url) {
      const path = post.image_url.split("/storage/v1/object/public/images/")[1];
      await supabase.storage.from("images").remove([path]);
    }

    return true;
  } catch (err) {
    console.error("Delete error:", err);
    throw err;
  }
}

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { colors } = useTheme();

  const loadProfileAndPosts = async () => {
    if (!user) return;
    try {
      setLoading(true);

      // fetch user profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(profileData);

      // fetch user posts
      const userPosts = await fetchMyPosts(user.id);
      setPosts(userPosts || []);
    } catch (e) {
      console.error("❌ error loading profile:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 💜 Fetch again when screen is focused (so new posts show immediately)
  useFocusEffect(
    useCallback(() => {
      loadProfileAndPosts();
    }, [user?.id])
  );

   useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel("profile-posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        (payload: any) => { // 👈 add :any here
          const newData = payload.new || {};
          const oldData = payload.old || {};

          // only reload if post belongs to current user
          if (newData.user_id === user.id || oldData.user_id === user.id) {
            loadProfileAndPosts();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);


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
        <ActivityIndicator size="large" color={colors.tint} />
        <Text style={{ marginTop: 12, fontSize: 15, color: colors.subtext }}>
          Loading profile...
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      style={{ flex: 1, backgroundColor: colors.background }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            loadProfileAndPosts();
          }}
          tintColor={colors.tint}
          colors={[colors.tint]}
        />
      }
      ListHeaderComponent={
        <View>
          {/* Profile Header Section */}
          <View
            style={{
              backgroundColor: colors.card,
              paddingTop: 60,
              paddingBottom: 32,
              paddingHorizontal: 24,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: colors.tint,
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

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "700",
                    color: colors.text,
                    marginBottom: 4,
                  }}
                >
                  {profile?.full_name || "User"}
                </Text>
                <Text style={{ fontSize: 14, color: colors.subtext }}>
                  {profile?.email}
                </Text>
              </View>
            </View>

            {/* Stats */}
            <View
              style={{
                flexDirection: "row",
                backgroundColor: colors.background,
                borderRadius: 12,
                padding: 20,
                marginBottom: 20,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "700",
                    color: colors.text,
                    marginBottom: 4,
                  }}
                >
                  {posts.length}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: colors.subtext,
                    fontWeight: "500",
                  }}
                >
                  Total Posts
                </Text>
              </View>

              <View
                style={{
                  width: 1,
                  backgroundColor: colors.border,
                  marginHorizontal: 20,
                }}
              />

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "700",
                    color: colors.text,
                    marginBottom: 4,
                  }}
                >
                  {dayjs(profile?.created_at).format("MMM 'YY")}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: colors.subtext,
                    fontWeight: "500",
                  }}
                >
                  Member Since
                </Text>
              </View>
            </View>

            {/* Logout */}
            <TouchableOpacity
              onPress={signOut}
              style={{
                borderWidth: 1.5,
                borderColor: colors.border,
                padding: 16,
                borderRadius: 12,
                backgroundColor: colors.card,
              }}
              activeOpacity={0.7}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: colors.subtext,
                  fontWeight: "600",
                  fontSize: 15,
                }}
              >
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>

          {/* My Posts Header */}
          <View
            style={{
              paddingHorizontal: 24,
              paddingTop: 32,
              paddingBottom: 16,
              backgroundColor: colors.background,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: colors.text,
                marginBottom: 4,
              }}
            >
              My Posts
            </Text>
            <Text style={{ fontSize: 14, color: colors.subtext }}>
              {posts.length === 0
                ? "No posts yet"
                : `${posts.length} ${
                    posts.length === 1 ? "post" : "posts"
                  } published`}
            </Text>
          </View>
        </View>
      }
      contentContainerStyle={{ paddingBottom: 32 }}
      renderItem={({ item }) => (
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: 16,
            marginHorizontal: 16,
            marginBottom: 16,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          {/* Header */}
          <View
            style={{
              padding: 16,
              borderBottomWidth: item.content || item.image_url ? 1 : 0,
              borderBottomColor: colors.border,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontSize: 13, color: colors.subtext, fontWeight: "500" }}
            >
              {dayjs(item.created_at).format("MMM D, YYYY")}
            </Text>

            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "Delete Post",
                  "Are you sure you want to delete this post?",
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
                borderColor: "#fca5a5",
                backgroundColor: "#fee2e2",
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

          {/* Content */}
          {item.content ? (
            <View
              style={{
                paddingHorizontal: 16,
                paddingTop: 16,
                paddingBottom: item.image_url ? 12 : 16,
              }}
            >
              <Text style={{ fontSize: 15, color: colors.text, lineHeight: 22 }}>
                {item.content}
              </Text>
            </View>
          ) : null}

          {/* Image */}
          {item.image_url ? (
            <Image
              source={{ uri: item.image_url }}
              style={{
                width: "100%",
                height: 300,
                backgroundColor: colors.border,
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
              backgroundColor: colors.border,
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
              color: colors.text,
              marginBottom: 8,
            }}
          >
            No posts yet
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: colors.subtext,
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
