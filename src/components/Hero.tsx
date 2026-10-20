import Link from "next/link";

export default function Hero() {
  return (
    <section id="hero" className="home-hero">
      <p className="home-eyebrow">老吴咖啡实验室 / LABSOFT</p>
      <h1>热爱技术。<br/><span>也热爱生活。</span></h1>
      <p className="home-hero-copy">从人工智能到真实世界，从一行代码到一杯咖啡。<br className="home-desktop-break"/>在这里，把好奇心变成新的可能。</p>
      <div className="home-actions"><a href="#services" className="home-button">探索我们做的事 <span aria-hidden="true">↓</span></a><a href="#download" className="home-text-link">获取应用 <span aria-hidden="true">↗</span></a></div>
      <div className="home-orbit" aria-hidden="true"><div className="home-orbit-ring ring-one"/><div className="home-orbit-ring ring-two"/><div className="home-orbit-core">LW<span>LABSOFT</span></div><span className="orbit-label orbit-ai">AI Research</span><span className="orbit-label orbit-robotics">Robotics</span><span className="orbit-label orbit-xr">Next-Gen XRs</span><i className="orbit-dot dot-one"/><i className="orbit-dot dot-two"/></div>
      <div className="home-hero-bottom"><span>你好，老吴咖啡。</span><Link href="/#about">至少理想还在，故事还在继续。 <span aria-hidden="true">↗</span></Link></div>
    </section>
  );
}
