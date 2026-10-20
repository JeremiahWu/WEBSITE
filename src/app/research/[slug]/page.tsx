import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { research, type ResearchSlug } from "@/config/research";
import ResearchVisual from "@/components/ResearchVisual";
import "./research.css";

export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(research).map((slug) => ({ slug }));
}
function getResearch(slug: string) {
  return Object.prototype.hasOwnProperty.call(research, slug) ? research[slug as ResearchSlug] : null;
}
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const item = getResearch(params.slug);
  return { title: item ? `${item.name} | LABSOFT` : "页面未找到 | LABSOFT", description: item?.intro };
}
export default function ResearchPage({ params }: { params: { slug: string } }) {
  const item = getResearch(params.slug);
  if (!item) notFound();
  return (
    <div className={`research-page theme-${item.theme}`}>
      <header className="research-nav">
        <div className="research-nav-inner">
          <Link href="/" className="research-brand">LABSOFT<span> / {item.english}</span></Link>
          <nav aria-label="研究方向导航">
            <Link href="/#services">返回首页</Link>
            <a href="#explore" className="research-nav-cta">深入了解 <span aria-hidden="true">↓</span></a>
          </nav>
        </div>
      </header>
      <main>
        <section className="research-hero">
          <p className="research-eyebrow">{item.english} <span> / {item.name}</span></p>
          <h1>{item.headline[0]}<br/><span>{item.headline[1]}</span></h1>
          <p className="research-intro">{item.intro}</p>
          <ResearchVisual theme={item.theme}/>
          <p className="research-concept-note">概念示意 · 展示研究方向，非已发布产品</p>
        </section>
        <section id="explore" className="research-overview research-container">
          <p className="research-eyebrow">探索方向 / {item.number}</p>
          <h2>{item.statement.split("\n").map((line) => <span key={line}>{line}<br/></span>)}</h2>
          <p>{item.overview}</p>
        </section>
        <section className="research-features" aria-label="核心研究方向">
          <div className="research-container">
            <div className="research-section-heading"><h2>每个细节，<br/>都是探索的起点。</h2><span>研究重点</span></div>
            <div className="research-feature-grid">
              {item.features.map((feature, index) => (
                <article key={feature.label} className="research-feature">
                  <div className="research-feature-top"><span>0{index + 1}</span><span>{feature.label}</span></div>
                  <div className={`feature-art art-${index}`} aria-hidden="true"><i/><i/><i/></div>
                  <h3>{feature.title}</h3><p>{feature.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="research-closing research-container">
          <p className="research-eyebrow">KEEP EXPLORING</p>
          <h2>{item.closing.split("\n").map((line) => <span key={line}>{line}<br/></span>)}</h2>
          <p>这些方向正在持续探索中。欢迎交流想法，一起讨论技术与生活的更多可能。</p>
          <a href="mailto:wuruihao629@laowu-cafe.com" className="research-contact">联系老吴 <span aria-hidden="true">↗</span></a>
        </section>
        <section className="research-related research-container" aria-label="更多研究方向">
          <h2>继续探索</h2>
          <div>{Object.entries(research).filter(([slug]) => slug !== params.slug).map(([slug, other]) => (
            <Link key={slug} href={`/research/${slug}`}><span><small>{other.english}</small>{other.name}</span><span aria-hidden="true">↗</span></Link>
          ))}</div>
        </section>
      </main>
      <footer className="research-footer research-container"><Link href="/">老吴咖啡实验室 · LABSOFT</Link><span>技术与生活，持续探索。</span></footer>
    </div>
  );
}
