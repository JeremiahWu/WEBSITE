import type { Metadata } from "next";
import Link from "next/link";
import About from "@/components/About";
export const metadata: Metadata = { title: "关于老吴 | 老吴咖啡实验室", description: "从库尔勒到厦门，从代码到咖啡，认识热爱技术与生活的老吴。" };
export default function AboutPage() {
  return <><About /><section className="home-story-next home-container"><Link href="/values">了解我的价值观 <span aria-hidden="true">↗</span></Link><Link href="/">返回首页 <span aria-hidden="true">↗</span></Link></section></>;
}
