import Link from "next/link";

export default function StoryLinks() {
  return (
    <>
      <section id="values" className="home-section home-story-section">
        <div className="home-container home-github-layout">
          <div>
            <p className="home-eyebrow">价值观 / WHAT WE BELIEVE</p>
            <h2>有些热爱，<br/><span>无法用数字衡量。</span></h2>
            <p className="home-github-copy">相信技术，也相信微小改变的力量。用所学所得，为这个世界带来一些力所能及的改变。</p>
            <Link href="/values" className="home-button">了解我的价值观 <span aria-hidden="true">↗</span></Link>
          </div>
          <Link href="/values" className="home-story-belief" aria-label="阅读价值观介绍">
            <span className="home-belief-mark" aria-hidden="true">“</span>
            <p>理想还在。<br/>热爱，就有方向。</p>
            <span className="home-belief-caption">KEEP BELIEVING <span aria-hidden="true">↗</span></span>
          </Link>
        </div>
      </section>
      <section id="about" className="home-section home-story-section home-story-about">
        <div className="home-container home-github-layout">
          <div>
            <p className="home-eyebrow">关于老吴 / THE PERSON BEHIND THE LAB</p>
            <h2>从代码到咖啡。<br/><span>你好，我是老吴。</span></h2>
            <p className="home-github-copy">从库尔勒到厦门，一个热爱技术、热爱生活的人。这里有我的探索，也有代码之外的日常。</p>
            <Link href="/about" className="home-button">读一读我的故事 <span aria-hidden="true">↗</span></Link>
          </div>
          <Link href="/about" className="home-story-portrait" aria-label="阅读关于老吴的介绍">
            <img src="/images/about/1.jpeg" alt="老吴的生活记录" width={600} height={600} loading="lazy" />
            <span>生活的美好，就是美好的生活。 <span aria-hidden="true">↗</span></span>
          </Link>
        </div>
      </section>
    </>
  );
}
