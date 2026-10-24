import BrandLogo from "@/components/BrandLogo";

export default function Hero() {
  return (
    <section id="hero" className="home-hero">
      <div className="home-hero-background" aria-hidden="true">
        <video autoPlay muted loop playsInline preload="metadata" poster="/images/hero-bg.jpg" tabIndex={-1}>
          <source src="/videos/hero.webm" type="video/webm" />
        </video>
        <div className="home-hero-veil" />
      </div>
      <p className="home-eyebrow">老吴咖啡实验室 / LAOWU-CAFE Labs</p>
      <h1>生活的美好<br/><span>就是美好的生活</span></h1>
      <p className="home-hero-copy">老吴咖啡实验室欢迎您！</p>
      <div className="home-actions"><a href="#services" className="home-button">探索我们做的事 <span aria-hidden="true">↓</span></a><a href="#download" className="home-text-link">获取应用 <span aria-hidden="true">↗</span></a></div>
      <div className="home-orbit" aria-hidden="true"><div className="home-orbit-ring ring-one"/><div className="home-orbit-ring ring-two"/><div className="home-orbit-core home-orbit-logo"><BrandLogo variant="hero" decorative /></div><span className="orbit-label orbit-ai">AI Research</span><span className="orbit-label orbit-robotics">Embodied Intelligence</span><span className="orbit-label orbit-xr">Next-Generation Personal Devices</span><i className="orbit-dot dot-one"/><i className="orbit-dot dot-two"/></div>
      <div className="home-hero-bottom"><span>你好，老吴咖啡。</span></div>
    </section>
  );
}
