import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { apiRequest } from "@/services/api";
import { Colors } from "@/constants/theme";

type Props = {
  visible: boolean;
  onClose: () => void;
  onPostCreated: () => void;
};

const visibilityOptions = [
  { value: "public", label: "公开", icon: "globe-outline" as const },
  { value: "friends", label: "好友", icon: "people-outline" as const },
  { value: "private", label: "私密", icon: "lock-closed-outline" as const },
];

export default function CreatePostModal({ visible, onClose, onPostCreated }: Props) {
  const [content, setContent] = useState("");
  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [visibility, setVisibility] = useState("public");
  const [loading, setLoading] = useState(false);

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImages((prev) => [...prev, ...result.assets].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePost = async () => {
    if (!content.trim()) {
      Alert.alert("提示", "请输入动态内容");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("content", content.trim());
      formData.append("visibility", visibility);
      images.forEach((img, i) => {
        const ext = img.uri.split(".").pop() || "jpg";
        formData.append("images", {
          uri: img.uri,
          type: `image/${ext === "jpg" ? "jpeg" : ext}`,
          name: `image_${i}.${ext}`,
        } as any);
      });

      const res = await apiRequest("/posts", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      setContent("");
      setImages([]);
      setVisibility("public");
      onPostCreated();
      onClose();
    } catch (e: any) {
      Alert.alert("发布失败", e.message || "请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={26} color={Colors.dark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>发布动态</Text>
          <TouchableOpacity
            style={[styles.postBtn, loading && styles.postBtnDisabled]}
            onPress={handlePost}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <Text style={styles.postBtnText}>发布</Text>
            )}
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="分享你的想法..."
          placeholderTextColor={Colors.muted}
          multiline
          value={content}
          onChangeText={setContent}
          autoFocus
        />

        {images.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageRow}>
            {images.map((img, i) => (
              <View key={i} style={styles.imageWrapper}>
                <Image source={{ uri: img.uri }} style={styles.thumbnail} />
                <TouchableOpacity style={styles.removeBtn} onPress={() => removeImage(i)}>
                  <Ionicons name="close-circle" size={22} color="#e74c3c" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        <View style={styles.toolbar}>
          <TouchableOpacity style={styles.toolBtn} onPress={pickImages}>
            <Ionicons name="image-outline" size={24} color={Colors.primary} />
            <Text style={styles.toolText}>图片 ({images.length}/5)</Text>
          </TouchableOpacity>

          <View style={styles.visRow}>
            {visibilityOptions.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.visBtn, visibility === opt.value && styles.visBtnActive]}
                onPress={() => setVisibility(opt.value)}
              >
                <Ionicons
                  name={opt.icon}
                  size={16}
                  color={visibility === opt.value ? Colors.white : Colors.muted}
                />
                <Text
                  style={[
                    styles.visText,
                    visibility === opt.value && styles.visTextActive,
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white, paddingTop: 50 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: 17, fontWeight: "bold", color: Colors.dark },
  postBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postBtnDisabled: { opacity: 0.6 },
  postBtnText: { color: Colors.white, fontWeight: "bold", fontSize: 14 },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: Colors.dark,
    textAlignVertical: "top",
  },
  imageRow: { paddingHorizontal: 16, paddingBottom: 12 },
  imageWrapper: { marginRight: 8, position: "relative" },
  thumbnail: { width: 80, height: 80, borderRadius: 10 },
  removeBtn: { position: "absolute", top: -6, right: -6 },
  toolbar: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    padding: 12,
    paddingBottom: 30,
  },
  toolBtn: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  toolText: { marginLeft: 8, color: Colors.primary, fontSize: 14 },
  visRow: { flexDirection: "row", gap: 8 },
  visBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.light,
    gap: 4,
  },
  visBtnActive: { backgroundColor: Colors.primary },
  visText: { fontSize: 13, color: Colors.muted },
  visTextActive: { color: Colors.white },
});
