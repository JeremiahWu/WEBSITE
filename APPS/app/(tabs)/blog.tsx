import { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BlogCard from "@/components/BlogCard";
import { apiRequest } from "@/services/api";
import { Colors } from "@/constants/theme";

type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  featuredImage: string | null;
  author: string;
};

export default function BlogScreen() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchPosts = useCallback(async () => {
    setError("");
    try {
      const res = await apiRequest("/blog/posts");
      const data = await res.json();
      if (res.ok) {
        setPosts(data.data);
      } else {
        setError(data.error || "加载失败");
      }
    } catch {
      setError("无法连接服务器");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error ? (
        <View style={styles.errorBox}>
          <Ionicons name="cloud-offline-outline" size={48} color={Colors.muted} />
          <Text style={styles.errorTitle}>博客服务暂不可用</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <BlogCard
              post={item}
              onPress={() => {
                // Open full post in browser as fallback
                const url = `${process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000"}/blog/posts/${item.id}`;
                Linking.openURL(url).catch(() => {});
              }}
            />
          )}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="book-outline" size={48} color={Colors.muted} />
              <Text style={styles.emptyText}>暂无博客文章</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { paddingTop: 12, paddingBottom: 20 },
  empty: { alignItems: "center", marginTop: 100, gap: 8 },
  emptyText: { fontSize: 16, color: Colors.muted },
  errorBox: { flex: 1, justifyContent: "center", alignItems: "center", gap: 8, padding: 40 },
  errorTitle: { fontSize: 18, fontWeight: "bold", color: Colors.dark },
  errorText: { fontSize: 14, color: Colors.muted, textAlign: "center" },
});
