import type { Metadata } from "next";
import Link from "next/link";
import Values from "@/components/Values";
export const metadata: Metadata = { title: "价值观 | 老吴咖啡实验室", description: "有些热爱，无法用数字衡量。用技术与实践，为世界带来力所能及的改变。" };
export default function ValuesPage() {
  return <><Values /><section className="home-story-next home-container"><Link href="/about">认识老吴 <span aria-hidden="true">↗</span></Link><Link href="/">返回首页 <span aria-hidden="true">↗</span></Link></section></>;
}
