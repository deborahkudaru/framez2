import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, RefreshControl, ActivityIndicator } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { supabase } from "../lib/supabase";

dayjs.extend(relativeTime);

export default function FeedScreen() {
  const [posts, setPosts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setRefreshing(true);
    const { data, error } = await supabase
      .from("posts")
      .select(`id, content, image_url, created_at, user_id, profiles(full_name)`)
      .order("created_at", { ascending: false });

    if (error) console.error("❌ fetch error:", error);
    else setPosts(data || []);
    setRefreshing(false);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFFFFF" }}>
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={{ marginTop: 12, fontSize: 15, color: "#6b7280" }}>Loading feed...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      style={{ flex: 1, backgroundColor: "#f9fafb" }}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={fetchPosts}
          tintColor="#7c3aed"
          colors={["#7c3aed"]}
        />
      }
      ListHeaderComponent={
        <View style={{ 
          paddingHorizontal: 24, 
          paddingTop: 20, 
          paddingBottom: 16,
          backgroundColor: "#FFFFFF",
          borderBottomWidth: 1,
          borderBottomColor: "#e5e7eb"
        }}>
          <Text style={{ fontSize: 28, fontWeight: "700", color: "#1a1a1a" }}>
            Feed
          </Text>
          <Text style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>
            Latest posts from the community
          </Text>
        </View>
      }
      contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
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
          <View style={{ 
            padding: 16, 
            flexDirection: "row", 
            alignItems: "center",
            borderBottomWidth: item.content || item.image_url ? 1 : 0,
            borderBottomColor: "#f3f4f6"
          }}>
            {/* Avatar */}
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#7c3aed",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
            }}>
              <Text style={{ fontSize: 16, fontWeight: "600", color: "#FFFFFF" }}>
                {item.profiles?.full_name?.charAt(0).toUpperCase() || "U"}
              </Text>
            </View>

            {/* User Info & Timestamp */}
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: "600", color: "#1a1a1a" }}>
                {item.profiles?.full_name || "Anonymous"}
              </Text>
              <Text style={{ fontSize: 13, color: "#9ca3af", marginTop: 2 }}>
                {dayjs(item.created_at).fromNow()}
              </Text>
            </View>
          </View>

          {/* Post Content */}
          {item.content ? (
            <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: item.image_url ? 12 : 16 }}>
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
                height: 320,
                backgroundColor: "#f3f4f6"
              }}
              resizeMode="cover"
            />
          ) : null}

          {/* Post Footer - Optional engagement area */}
          <View style={{ 
            paddingHorizontal: 16, 
            paddingVertical: 12,
            borderTopWidth: 1,
            borderTopColor: "#f3f4f6"
          }}>
            <Text style={{ fontSize: 12, color: "#9ca3af" }}>
              {dayjs(item.created_at).format("MMM D, YYYY • h:mm A")}
            </Text>
          </View>
        </View>
      )}
      ListEmptyComponent={
        <View style={{ 
          alignItems: "center", 
          paddingVertical: 64,
          paddingHorizontal: 24 
        }}>
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: "#f3f4f6",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20
          }}>
            <Text style={{ fontSize: 36 }}>📱</Text>
          </View>
          <Text style={{ 
            fontSize: 20, 
            fontWeight: "700", 
            color: "#1a1a1a",
            marginBottom: 8 
          }}>
            No posts yet
          </Text>
          <Text style={{ 
            fontSize: 15, 
            color: "#6b7280", 
            textAlign: "center",
            lineHeight: 22 
          }}>
            Be the first to share something{"\n"}with the Framez community
          </Text>
        </View>
      }
    />
  );
}