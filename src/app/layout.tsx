import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "老吴咖啡实验室 | Laowu-Cafe Labs",
  description: "老吴咖啡实验室：人工智能研究、具身智能、下一代个人终端与基本应用软件 LabSoft。",
  icons: { icon: "/images/laowu-cafe-logo.png", apple: "/images/laowu-cafe-logo.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
