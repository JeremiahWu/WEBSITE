import { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { apiRequest } from "@/services/api";
import PostCard from "@/components/PostCard";
import CreatePostModal from "@/components/CreatePostModal";
import { Colors } from "@/constants/theme";

type Post = {
  id: number;
  content: string;
  visibility: string;
  created_at: string;
  author: { id: number; username: string; avatar: string | null };
  images: { id: number; image_url: string }[];
};

export default function FeedScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await apiRequest("/posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data.data);
      }
    } catch {} finally {
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
      <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <PostCard post={item} />}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="newspaper-outline" size={48} color={Colors.muted} />
            <Text style={styles.emptyText}>暂无动态</Text>
            <Text style={styles.emptyHint}>点击右下角按钮发表第一条动态</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={() => setShowModal(true)}>
        <Ionicons name="add" size={28} color={Colors.white} />
      </TouchableOpacity>

      <CreatePostModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onPostCreated={fetchPosts}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { paddingTop: 12, paddingBottom: 80 },
  empty: { alignItems: "center", marginTop: 100, gap: 8 },
  emptyText: { fontSize: 16, color: Colors.muted, fontWeight: "bold" },
  emptyHint: { fontSize: 13, color: Colors.muted },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});
