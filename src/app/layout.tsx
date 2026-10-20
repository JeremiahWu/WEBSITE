import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "老吴咖啡实验室 | LABSOFT",
  description: "老吴咖啡实验室 - 软件基础服务",
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
