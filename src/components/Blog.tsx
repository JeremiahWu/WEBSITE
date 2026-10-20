import { contact } from "@/config/contact";

export default function Blog() {
  return (
    <section id="blog" className="home-section home-blog">
      <div className="home-container home-github-layout">
        <div>
          <p className="home-eyebrow">博客 / NOTES ALONG THE WAY</p>
          <h2>把探索，写下来。<br/><span>让思考，继续生长。</span></h2>
          <p className="home-github-copy">记录技术探索，也分享生活里的所见所想。从代码背后的思考，到一杯咖啡之间的灵感，欢迎来我的博客坐坐。</p>
          <a href={contact.blog} target="_blank" rel="noopener noreferrer" className="home-button">阅读我的博客 <span aria-hidden="true">↗</span></a>
        </div>
        <a href={contact.blog} target="_blank" rel="noopener noreferrer" className="home-blog-card" aria-label="访问老吴的博客（新标签页）">
          <span className="home-blog-label">LAOWU / JOURNAL</span>
          <svg viewBox="0 0 80 80" fill="none" aria-hidden="true"><rect x="17" y="10" width="46" height="60" rx="8" stroke="currentColor" strokeWidth="2"/><path d="M28 27h24M28 38h24M28 49h15M25 10v60" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          <span className="home-blog-title">技术与生活的随笔。</span>
          <span className="home-blog-address">blog.laowu.cafe <span aria-hidden="true">↗</span></span>
        </a>
      </div>
    </section>
  );
}
