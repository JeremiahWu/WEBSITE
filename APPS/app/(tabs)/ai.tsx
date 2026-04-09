import { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ChatBubble from "@/components/ChatBubble";
import { apiRequest } from "@/services/api";
import { Colors } from "@/constants/theme";

type Message = { role: "user" | "assistant"; content: string };

export default function AIScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await apiRequest("/ai/chat", {
        method: "POST",
        body: JSON.stringify({ messages: updated }),
      });
      const data = await res.json();
      if (res.ok && data.message) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.message.content }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.error || "AI 服务暂不可用，请稍后再试" },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "网络错误，无法连接 AI 服务" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => <ChatBubble message={item} />}
        contentContainerStyle={styles.list}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        ListEmptyComponent={
          <View style={styles.welcome}>
            <Ionicons name="chatbubble-ellipses-outline" size={48} color={Colors.muted} />
            <Text style={styles.welcomeTitle}>AI 助手</Text>
            <Text style={styles.welcomeText}>有什么我可以帮助你的吗？</Text>
          </View>
        }
      />

      {loading && (
        <View style={styles.typingRow}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.typingText}>AI 正在思考...</Text>
        </View>
      )}

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="输入消息..."
          placeholderTextColor={Colors.muted}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={send}
          returnKeyType="send"
          editable={!loading}
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
          onPress={send}
          disabled={!input.trim() || loading}
        >
          <Ionicons name="send" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  list: { paddingVertical: 12, flexGrow: 1 },
  welcome: { flex: 1, justifyContent: "center", alignItems: "center", marginTop: 120, gap: 8 },
  welcomeTitle: { fontSize: 20, fontWeight: "bold", color: Colors.dark },
  welcomeText: { fontSize: 14, color: Colors.muted },
  typingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 6,
  },
  typingText: { fontSize: 13, color: Colors.muted },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.white,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.light,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.dark,
    marginRight: 8,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  sendBtnDisabled: { opacity: 0.4 },
});
