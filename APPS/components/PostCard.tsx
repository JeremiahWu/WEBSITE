import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { Colors } from "@/constants/theme";
import { API_BASE } from "@/constants/api";

type PostProps = {
  post: {
    id: number;
    content: string;
    visibility: string;
    created_at: string;
    author: { id: number; username: string; avatar: string | null };
    images: { id: number; image_url: string }[];
  };
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "刚刚";
  if (mins < 60) return `${mins}分钟前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  return `${days}天前`;
}

const visibilityLabel: Record<string, string> = {
  public: "公开",
  friends: "好友",
  private: "私密",
};

export default function PostCard({ post }: PostProps) {
  const initials = post.author.username.slice(0, 2).toUpperCase();

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {post.author.avatar ? (
          <Image
            source={{ uri: `${API_BASE}${post.author.avatar}` }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.username}>{post.author.username}</Text>
          <Text style={styles.time}>{timeAgo(post.created_at)}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {visibilityLabel[post.visibility] || post.visibility}
          </Text>
        </View>
      </View>

      <Text style={styles.content}>{post.content}</Text>

      {post.images.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageRow}>
          {post.images.map((img) => (
            <Image
              key={img.id}
              source={{ uri: `${API_BASE}${img.image_url}` }}
              style={styles.postImage}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: { color: Colors.white, fontWeight: "bold", fontSize: 14 },
  username: { fontWeight: "bold", color: Colors.dark, fontSize: 15 },
  time: { color: Colors.muted, fontSize: 12, marginTop: 1 },
  badge: {
    backgroundColor: Colors.light,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: { fontSize: 11, color: Colors.muted },
  content: { fontSize: 15, color: Colors.dark, lineHeight: 22, marginBottom: 8 },
  imageRow: { marginTop: 4 },
  postImage: { width: 200, height: 200, borderRadius: 12, marginRight: 8 },
});
