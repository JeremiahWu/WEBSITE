import ResearchVisual from "@/components/ResearchVisual";
import { research } from "@/config/research";
export default function Services() {
  return (
    <section id="services" className="home-section home-research">
      <div className="home-container">
        <div className="home-section-heading"><div><p className="home-eyebrow">WHAT WE DO</p><h2>我们做什么？</h2></div></div>
        <div className="home-research-grid">{Object.entries(research).map(([slug, item]) => <article key={slug} className={`home-research-card home-card-${item.theme}`}>
          <div className="home-card-label"><span>{item.english}</span><span>{item.number}</span></div>
          <h3>{item.name}</h3><p>{item.intro}</p>
          <ResearchVisual theme={item.theme}/>
        </article>)}</div>
      </div>
    </section>
  );
}
