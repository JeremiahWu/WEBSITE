import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/theme";

type Props = {
  message: { role: "user" | "assistant"; content: string };
};

export default function ChatBubble({ message }: Props) {
  const isUser = message.role === "user";
  return (
    <View style={[styles.row, isUser && styles.rowUser]}>
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI]}>
        <Text style={[styles.text, isUser && styles.textUser]}>{message.content}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", marginBottom: 10, paddingHorizontal: 12 },
  rowUser: { justifyContent: "flex-end" },
  bubble: { maxWidth: "80%", padding: 12, borderRadius: 16 },
  bubbleUser: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    backgroundColor: Colors.light,
    borderBottomLeftRadius: 4,
  },
  text: { fontSize: 15, lineHeight: 22, color: Colors.dark },
  textUser: { color: Colors.white },
});
