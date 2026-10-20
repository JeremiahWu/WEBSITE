import Link from "next/link";
import ResearchVisual from "@/components/ResearchVisual";
import { research } from "@/config/research";
export default function Services() {
  return (
    <section id="services" className="home-section home-research">
      <div className="home-container">
        <div className="home-section-heading"><div><p className="home-eyebrow">OUR EXPLORATIONS</p><h2>我们做什么？<br/><span>让想象，向前一步。</span></h2></div><p>从智能算法到物理世界，<br/>探索技术与人相遇的下一种方式。</p></div>
        <div className="home-research-grid">{Object.entries(research).map(([slug, item]) => <Link key={slug} href={`/research/${slug}`} className={`home-research-card home-card-${item.theme}`}>
          <div className="home-card-label"><span>{item.english}</span><span>{item.number}</span></div>
          <h3>{item.name}</h3><p>{item.intro}</p>
          <ResearchVisual theme={item.theme}/>
          <span className="home-card-link">深入了解 <span aria-hidden="true">↗</span></span>
        </Link>)}</div>
      </div>
    </section>
  );
}
