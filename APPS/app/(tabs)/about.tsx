import { useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/theme";
import { API_BASE } from "@/constants/api";

type AboutData = {
  name: string;
  nameEn: string;
  tagline: string;
  description: string;
  contact: { address: string; email: string };
};

const fallback: AboutData = {
  name: "老吴咖啡实验室",
  nameEn: "LABSOFT",
  tagline: "老吴同志在看着你",
  description: "一个热爱技术、热爱生活的人。从库尔勒到厦门，从代码到咖啡，老吴咖啡实验室承载着对技术与生活的热情。",
  contact: { address: "福建省厦门市集美区", email: "wuruihao629@laowu-cafe.com" },
};

export default function AboutScreen() {
  const [info, setInfo] = useState<AboutData>(fallback);

  useEffect(() => {
    fetch(`${API_BASE}/api/about`)
      .then((r) => r.json())
      .then((d) => setInfo(d.data))
      .catch(() => {});
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>LW</Text>
        </View>
        <Text style={styles.name}>{info.name}</Text>
        <Text style={styles.nameEn}>{info.nameEn}</Text>
        <Text style={styles.tagline}>{info.tagline}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>简介</Text>
        <Text style={styles.desc}>{info.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>联系方式</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>地址</Text>
          <Text style={styles.infoValue}>{info.contact.address}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>邮箱</Text>
          <Text style={styles.infoValue}>{info.contact.email}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>技术栈</Text>
        <View style={styles.tagsRow}>
          {["Next.js", "React Native", "Expo", "Express.js", "TypeScript", "Node.js"].map(
            (t) => (
              <View key={t} style={styles.tag}>
                <Text style={styles.tagText}>{t}</Text>
              </View>
            )
          )}
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light },
  header: {
    backgroundColor: Colors.dark,
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarText: { color: Colors.white, fontSize: 32, fontWeight: "bold" },
  name: { color: Colors.white, fontSize: 24, fontWeight: "bold" },
  nameEn: { color: "rgba(255,255,255,0.5)", fontSize: 14, marginTop: 4 },
  tagline: { color: "rgba(255,255,255,0.7)", fontSize: 15, marginTop: 8 },
  section: { paddingHorizontal: 20, paddingTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: Colors.dark, marginBottom: 12 },
  desc: { fontSize: 15, color: Colors.muted, lineHeight: 24 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoLabel: { fontSize: 14, color: Colors.muted },
  infoValue: { fontSize: 14, color: Colors.dark, fontWeight: "500" },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: {
    backgroundColor: "rgba(43,191,224,0.1)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: { color: Colors.primary, fontSize: 13, fontWeight: "500" },
});
