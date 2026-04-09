import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/theme";

type Props = {
  post: {
    id: number;
    title: string;
    excerpt: string;
    featuredImage: string | null;
    date: string;
    author: string;
  };
  onPress?: () => void;
};

export default function BlogCard({ post, onPress }: Props) {
  const dateStr = new Date(post.date).toLocaleDateString("zh-CN");

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {post.featuredImage && (
        <Image
          source={{ uri: post.featuredImage }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {post.title}
        </Text>
        <Text style={styles.excerpt} numberOfLines={3}>
          {post.excerpt}
        </Text>
        <View style={styles.meta}>
          <Text style={styles.metaText}>{post.author}</Text>
          <Text style={styles.metaText}>{dateStr}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  image: { width: "100%", height: 180 },
  body: { padding: 16 },
  title: { fontSize: 17, fontWeight: "bold", color: Colors.dark, marginBottom: 6 },
  excerpt: { fontSize: 14, color: Colors.muted, lineHeight: 20, marginBottom: 10 },
  meta: { flexDirection: "row", justifyContent: "space-between" },
  metaText: { fontSize: 12, color: Colors.muted },
});
