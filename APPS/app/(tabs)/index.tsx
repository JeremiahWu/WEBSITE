import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>LW</Text>
        </View>
        <Text style={styles.heroTitle}>你好，老吴咖啡</Text>
        <Text style={styles.heroSub}>老吴咖啡实验室 | LABSOFT</Text>
        <Text style={styles.heroQuote}>
          生活的美好就是美好的生活
        </Text>
      </View>

      {/* Quick stats */}
      <View style={styles.statsRow}>
        {[
          { icon: "document-text" as const, label: "周推送", value: "1篇" },
          { icon: "LABSOFT" as const, label: "服务器", value: "3地" },
          { icon: "people" as const, label: "服务", value: "3项" },
        ].map((s, i) => (
          <View key={i} style={styles.statCard}>
            <Ionicons name={s.icon} size={24} color={Colors.primary} />
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Values */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>价值观</Text>
        <Text style={styles.sectionText}>
          我相信这个世上还是有一些东西是用金钱无法量度的，我们生活的意义是为了给这个世界带来一些力所能及的改变。
        </Text>
        <View style={styles.quoteBox}>
          <Text style={styles.quoteText}>
            Through many dangers, toils and snares, I have already come;{"\n"}
            &apos;Tis grace hath brought me safe thus far, and grace will lead me home.
          </Text>
        </View>
      </View>

      {/* Motto */}
      <View style={styles.mottoBar}>
        <Text style={styles.mottoText}>
          &ldquo;So we beat on, boats against the current, borne back ceaselessly into the past.&rdquo;
        </Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  hero: {
    backgroundColor: Colors.dark,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(43,191,224,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  logoText: { color: Colors.white, fontSize: 28, fontWeight: "bold" },
  heroTitle: { color: Colors.white, fontSize: 28, fontWeight: "bold", marginBottom: 8 },
  heroSub: { color: "rgba(255,255,255,0.6)", fontSize: 14, marginBottom: 16 },
  heroQuote: { color: "rgba(255,255,255,0.8)", fontSize: 16, textAlign: "center" },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.light,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  statValue: { fontSize: 20, fontWeight: "bold", color: Colors.dark, marginTop: 8 },
  statLabel: { fontSize: 12, color: Colors.muted, marginTop: 4 },
  section: { paddingHorizontal: 20, paddingVertical: 24 },
  sectionTitle: { fontSize: 22, fontWeight: "bold", color: Colors.dark, marginBottom: 12 },
  sectionText: { fontSize: 15, color: Colors.muted, lineHeight: 24 },
  quoteBox: {
    marginTop: 16,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    paddingLeft: 16,
    paddingVertical: 8,
  },
  quoteText: { fontStyle: "italic", color: Colors.muted, lineHeight: 22 },
  mottoBar: {
    backgroundColor: Colors.dark,
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  mottoText: {
    color: "rgba(255,255,255,0.8)",
    fontStyle: "italic",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 24,
  },
});
