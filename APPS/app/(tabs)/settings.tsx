import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  Switch,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/services/api";
import { Colors } from "@/constants/theme";
import { API_BASE } from "@/constants/api";

export default function SettingsScreen() {
  const { user, logout, updateUser } = useAuth();
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [saving, setSaving] = useState(false);

  const [curPwd, setCurPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);

  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled) return;

    const formData = new FormData();
    const img = result.assets[0];
    const ext = img.uri.split(".").pop() || "jpg";
    formData.append("avatar", {
      uri: img.uri,
      type: `image/${ext === "jpg" ? "jpeg" : ext}`,
      name: `avatar.${ext}`,
    } as any);

    try {
      const res = await apiRequest("/user/profile", { method: "PUT", body: formData });
      if (res.ok) {
        const data = await res.json();
        updateUser(data);
      }
    } catch {}
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await apiRequest("/user/profile", {
        method: "PUT",
        body: JSON.stringify({ email, bio }),
      });
      const data = await res.json();
      if (res.ok) {
        updateUser(data);
        Alert.alert("成功", "个人信息已更新");
      } else {
        Alert.alert("失败", data.error || "更新失败");
      }
    } catch {
      Alert.alert("错误", "网络错误");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (!curPwd || !newPwd) {
      Alert.alert("提示", "请填写密码");
      return;
    }
    if (newPwd !== confirmPwd) {
      Alert.alert("提示", "新密码不一致");
      return;
    }
    setPwdLoading(true);
    try {
      const res = await apiRequest("/user/password", {
        method: "PUT",
        body: JSON.stringify({ currentPassword: curPwd, newPassword: newPwd }),
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert("成功", data.message || "密码已更新");
        setCurPwd("");
        setNewPwd("");
        setConfirmPwd("");
      } else {
        Alert.alert("失败", data.error);
      }
    } catch {
      Alert.alert("错误", "网络错误");
    } finally {
      setPwdLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("退出登录", "确定要退出吗？", [
      { text: "取消", style: "cancel" },
      { text: "退出", style: "destructive", onPress: logout },
    ]);
  };

  const initials = (user?.username || "U").slice(0, 2).toUpperCase();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>个人信息</Text>

        <TouchableOpacity style={styles.avatarRow} onPress={pickAvatar}>
          {user?.avatar ? (
            <Image source={{ uri: `${API_BASE}${user.avatar}` }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          )}
          <Text style={styles.avatarHint}>点击更换头像</Text>
        </TouchableOpacity>

        <Text style={styles.label}>用户名</Text>
        <View style={styles.readOnly}>
          <Text style={styles.readOnlyText}>{user?.username}</Text>
        </View>

        <Text style={styles.label}>邮箱</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>简介</Text>
        <TextInput
          style={[styles.input, styles.inputMulti]}
          value={bio}
          onChangeText={setBio}
          multiline
          placeholder="介绍一下自己..."
          placeholderTextColor={Colors.muted}
        />

        <TouchableOpacity style={styles.saveBtn} onPress={saveProfile} disabled={saving}>
          {saving ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.saveBtnText}>保存</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Password */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>修改密码</Text>
        <TextInput
          style={styles.input}
          placeholder="当前密码"
          placeholderTextColor={Colors.muted}
          secureTextEntry
          value={curPwd}
          onChangeText={setCurPwd}
        />
        <TextInput
          style={styles.input}
          placeholder="新密码"
          placeholderTextColor={Colors.muted}
          secureTextEntry
          value={newPwd}
          onChangeText={setNewPwd}
        />
        <TextInput
          style={styles.input}
          placeholder="确认新密码"
          placeholderTextColor={Colors.muted}
          secureTextEntry
          value={confirmPwd}
          onChangeText={setConfirmPwd}
        />
        <TouchableOpacity style={styles.saveBtn} onPress={changePassword} disabled={pwdLoading}>
          {pwdLoading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.saveBtnText}>更新密码</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>偏好设置</Text>
        <View style={styles.prefRow}>
          <View style={styles.prefLabel}>
            <Ionicons name="moon-outline" size={20} color={Colors.dark} />
            <Text style={styles.prefText}>深色模式</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ true: Colors.primary }}
          />
        </View>
        <View style={styles.prefRow}>
          <View style={styles.prefLabel}>
            <Ionicons name="notifications-outline" size={20} color={Colors.dark} />
            <Text style={styles.prefText}>推送通知</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ true: Colors.primary }}
          />
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#e74c3c" />
        <Text style={styles.logoutText}>退出登录</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light },
  content: { padding: 16, paddingTop: 8 },
  section: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 17, fontWeight: "bold", color: Colors.dark, marginBottom: 16 },
  avatarRow: { alignItems: "center", marginBottom: 16 },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: Colors.white, fontWeight: "bold", fontSize: 24 },
  avatarHint: { color: Colors.muted, fontSize: 12, marginTop: 6 },
  label: { fontSize: 13, color: Colors.muted, marginBottom: 4, marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: Colors.dark,
    backgroundColor: Colors.light,
    marginBottom: 8,
  },
  inputMulti: { minHeight: 80, textAlignVertical: "top" },
  readOnly: {
    backgroundColor: Colors.light,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  readOnlyText: { color: Colors.muted, fontSize: 15 },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    marginTop: 8,
  },
  saveBtnText: { color: Colors.white, fontWeight: "bold", fontSize: 15 },
  prefRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light,
  },
  prefLabel: { flexDirection: "row", alignItems: "center", gap: 10 },
  prefText: { fontSize: 15, color: Colors.dark },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e74c3c",
  },
  logoutText: { color: "#e74c3c", fontSize: 16, fontWeight: "bold" },
});
