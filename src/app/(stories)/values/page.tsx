import type { Metadata } from "next";
import Link from "next/link";
import Values from "@/components/Values";
export const metadata: Metadata = { title: "价值观 | 老吴咖啡实验室", description: "老吴咖啡实验室价值观：前沿探索、人文关怀、求真务实、孤独情结。" };
export default function ValuesPage() {
  return <><Values /><section className="home-story-next home-container"><Link href="/about">认识老吴 <span aria-hidden="true">↗</span></Link><Link href="/">返回首页 <span aria-hidden="true">↗</span></Link></section></>;
}
