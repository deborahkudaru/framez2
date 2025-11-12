import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import dayjs from "dayjs";
import { supabase } from "../lib/supabase";

export default function FeedScreen() {
  const [posts, setPosts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async () => {
    setRefreshing(true);
    const { data, error } = await supabase
      .from("posts")
      .select(`id, content, image_url, created_at, user_id`)
      .order("created_at", { ascending: false });

    if (error) console.error("❌ fetch error:", error);
    else setPosts(data || []);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchPosts} />
      }
      contentContainerStyle={{ padding: 12, gap: 12 }}
      renderItem={({ item }) => (
        <View style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}>
          <Text style={{ fontWeight: "600" }}>
            {dayjs(item.created_at).format("MMM D, YYYY h:mm A")}
          </Text>
          {item.content ? <Text>{item.content}</Text> : null}
          {item.image_url ? (
            <Image
              source={{ uri: item.image_url }}
              style={{ width: "100%", height: 300, borderRadius: 8 }}
            />
          ) : null}
        </View>
      )}
    />
  );
}
