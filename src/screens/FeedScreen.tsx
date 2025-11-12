import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { toggleLike, fetchLikesForPosts } from "../services/postService";
import { useTheme } from "../context/ThemeContext";

dayjs.extend(relativeTime);

export default function FeedScreen() {
  const { user } = useAuth();
  const { colors, isDark } = useTheme(); // 💜 Use global theme
  const [posts, setPosts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [likeCounts, setLikeCounts] = useState<{ [key: string]: number }>({});

  // Fetch posts + likes
  const fetchPosts = async () => {
    setRefreshing(true);
    const { data, error } = await supabase
      .from("posts")
      .select(
        `id, content, image_url, created_at, user_id, profiles(full_name)`
      )
      .order("created_at", { ascending: false });

    if (error) console.error("❌ fetch error:", error);
    else setPosts(data || []);

    // Fetch likes for user
    if (user?.id) {
      try {
        const likes = await fetchLikesForPosts(user.id);
        setLikedPosts(likes.map((l) => l.post_id));
      } catch (e) {
        console.error("❌ like fetch error:", e);
      }
    }

    // Fetch like counts
    const counts: any = {};
    for (const post of data || []) {
      const { count } = await supabase
        .from("likes")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post.id);
      counts[post.id] = count || 0;
    }
    setLikeCounts(counts);

    setRefreshing(false);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("realtime-posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        (payload) => {
          console.log("🔄 Realtime change:", payload);
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
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
            Loading feed...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar
        barStyle={colors.statusBarStyle}
        backgroundColor={colors.card}
      />

      {/* Header */}
      <View
        style={{
          paddingHorizontal: 24,
          paddingTop: Platform.OS === "android" ? 10 : 0,
          paddingBottom: 16,
          backgroundColor: colors.card,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
            color: colors.text,
            textAlign: "center",
          }}
        >
          Framez
        </Text>
      </View>

      {/* Feed */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchPosts}
            tintColor={colors.tint}
            colors={[colors.tint]}
          />
        }
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
        renderItem={({ item }) => {
          const isLiked = likedPosts.includes(item.id);
          const count = likeCounts[item.id] || 0;

          return (
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
              {/* Post Header */}
              <View
                style={{
                  padding: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  borderBottomWidth: item.content || item.image_url ? 1 : 0,
                  borderBottomColor: colors.border,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.tint,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 12,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#FFFFFF",
                    }}
                  >
                    {item.profiles?.full_name?.charAt(0).toUpperCase() || "U"}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "600",
                      color: colors.text,
                    }}
                  >
                    {item.profiles?.full_name || "Anonymous"}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: colors.subtext,
                      marginTop: 2,
                    }}
                  >
                    {dayjs(item.created_at).fromNow()}
                  </Text>
                </View>
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
                  <Text
                    style={{
                      fontSize: 15,
                      color: colors.text,
                      lineHeight: 22,
                    }}
                  >
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
                    height: 320,
                    backgroundColor: colors.border,
                  }}
                  resizeMode="cover"
                />
              ) : null}

              {/* Footer */}
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderTopWidth: 1,
                  borderTopColor: colors.border,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 12, color: colors.subtext }}>
                  {dayjs(item.created_at).format("MMM D, YYYY • h:mm A")}
                </Text>

                {/* Like Section */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={async () => {
                      if (!user?.id) return;
                      try {
                        await toggleLike(item.id, user.id, isLiked);
                        setLikedPosts((prev) =>
                          isLiked
                            ? prev.filter((id) => id !== item.id)
                            : [...prev, item.id]
                        );
                        setLikeCounts((prev) => ({
                          ...prev,
                          [item.id]: isLiked
                            ? Math.max(0, (prev[item.id] || 1) - 1)
                            : (prev[item.id] || 0) + 1,
                        }));
                      } catch (err) {
                        console.error("❌ Like error:", err);
                      }
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        color: isLiked ? "#ef4444" : colors.subtext,
                        fontWeight: "700",
                      }}
                    >
                      {isLiked ? "♥" : "♡"}
                    </Text>
                  </TouchableOpacity>

                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.subtext,
                      marginLeft: 8,
                    }}
                  >
                    {count} {count === 1 ? "like" : "likes"}
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}
