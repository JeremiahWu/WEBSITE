import { useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { API_BASE } from "@/constants/api";

type Service = { id: number; title: string; description: string; icon: string };

const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  pencil: "create-outline",
  settings: "settings-outline",
  globe: "globe-outline",
};

export default function ServicesScreen() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/services`)
      .then((r) => r.json())
      .then((d) => setServices(d.data))
      .catch(() => {
        setError("无法连接后端，显示本地数据");
        setServices([
          { id: 1, title: "微信号推送", description: "每周一篇文章推送，文章主要是工作学习生活中的点滴。", icon: "pencil" },
          { id: 2, title: "计算机网络服务", description: "远程技术支持，原版系统安装及工作软件配置。", icon: "settings" },
          { id: 3, title: "网站经营", description: "下载中心、数据监控中心等在线服务平台。", icon: "globe" },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>我们的服务</Text>
        <Text style={styles.headerSub}>为您提供专业的技术支持</Text>
      </View>

      {error ? (
        <View style={styles.errorBar}>
          <Ionicons name="cloud-offline-outline" size={16} color="#f59e0b" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {services.map((s) => (
        <View key={s.id} style={styles.card}>
          <View style={styles.cardIcon}>
            <Ionicons
              name={iconMap[s.icon] || "ellipse-outline"}
              size={28}
              color={Colors.primary}
            />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{s.title}</Text>
            <Text style={styles.cardDesc}>{s.description}</Text>
          </View>
        </View>
      ))}

      {/* Timeline */}
      <View style={styles.timeline}>
        <Text style={styles.timelineTitle}>发展路线</Text>
        {[
          { phase: "第一阶段", desc: "微信公众号推送，连通各地服务器" },
          { phase: "第二阶段", desc: "发布 iOS / Android 移动应用" },
          { phase: "第三阶段", desc: "开放 API，社区功能，生态完善" },
        ].map((t, i) => (
          <View key={i} style={styles.timelineItem}>
            <View style={styles.dot} />
            <View style={{ flex: 1 }}>
              <Text style={styles.phaseTitle}>{t.phase}</Text>
              <Text style={styles.phaseDesc}>{t.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: { backgroundColor: Colors.primary, padding: 24, paddingTop: 20 },
  headerTitle: { color: Colors.white, fontSize: 24, fontWeight: "bold" },
  headerSub: { color: "rgba(255,255,255,0.8)", fontSize: 14, marginTop: 4 },
  errorBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fef3c7",
    margin: 16,
    padding: 12,
    borderRadius: 12,
  },
  errorText: { color: "#92400e", fontSize: 13 },
  card: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(43,191,224,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: "600", color: Colors.dark, marginBottom: 6 },
  cardDesc: { fontSize: 14, color: Colors.muted, lineHeight: 20 },
  timeline: { padding: 20, marginTop: 8 },
  timelineTitle: { fontSize: 20, fontWeight: "bold", color: Colors.dark, marginBottom: 16 },
  timelineItem: { flexDirection: "row", alignItems: "flex-start", marginBottom: 16, gap: 12 },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    marginTop: 4,
  },
  phaseTitle: { fontSize: 15, fontWeight: "600", color: Colors.dark },
  phaseDesc: { fontSize: 13, color: Colors.muted, marginTop: 2 },
});
