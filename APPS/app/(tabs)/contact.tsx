import { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Colors } from "@/constants/theme";
import { API_BASE } from "@/constants/api";

export default function ContactScreen() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!email || !subject || !message) {
      Alert.alert("提示", "请填写所有字段");
      return;
    }
    setSending(true);
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, subject, message }),
      });
      const data = await res.json();
      if (data.success) {
        Alert.alert("成功", data.message);
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        Alert.alert("错误", data.errors?.join("\n") || "提交失败");
      }
    } catch {
      Alert.alert("错误", "网络连接失败，请确认后端已启动");
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.headerTitle}>联系我们</Text>
          <Text style={styles.headerSub}>有任何问题或建议，欢迎留言</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>邮箱</Text>
          <TextInput
            style={styles.input}
            placeholder="your@email.com"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>主题</Text>
          <TextInput
            style={styles.input}
            placeholder="请输入主题"
            placeholderTextColor="#aaa"
            value={subject}
            onChangeText={setSubject}
          />

          <Text style={styles.label}>消息</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="请输入消息内容..."
            placeholderTextColor="#aaa"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            value={message}
            onChangeText={setMessage}
          />

          <TouchableOpacity
            style={[styles.button, sending && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={sending}
          >
            <Text style={styles.buttonText}>
              {sending ? "发送中..." : "发送消息"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>其他联系方式</Text>
          <Text style={styles.infoItem}>E-mail: wuruihao629@laowu-cafe.com</Text>
          <Text style={styles.infoItem}>地址: 福建省厦门市集美区</Text>
          <Text style={styles.infoItem}>微信公众号: 老吴咖啡</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light },
  header: { backgroundColor: Colors.primary, padding: 24, paddingTop: 20 },
  headerTitle: { color: Colors.white, fontSize: 24, fontWeight: "bold" },
  headerSub: { color: "rgba(255,255,255,0.8)", fontSize: 14, marginTop: 4 },
  form: { padding: 20 },
  label: { fontSize: 14, fontWeight: "600", color: Colors.dark, marginBottom: 6, marginTop: 16 },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: Colors.dark,
  },
  textArea: { minHeight: 120 },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 24,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: Colors.white, fontSize: 16, fontWeight: "bold" },
  infoSection: { paddingHorizontal: 20, paddingTop: 24 },
  infoTitle: { fontSize: 18, fontWeight: "bold", color: Colors.dark, marginBottom: 12 },
  infoItem: { fontSize: 14, color: Colors.muted, marginBottom: 8 },
});
