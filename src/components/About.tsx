import { contact } from "@/config/contact";
export default function About() {
  const Heading = "h1";
  return <section id="about" className="home-section home-about"><div className="home-container"><div className="home-about-intro"><p className="home-eyebrow">THE PERSON BEHIND THE LAB</p><Heading>从代码到咖啡。<br/><span>你好，我是老吴。</span></Heading><p>一个热爱技术、热爱生活的人。从库尔勒到厦门，老吴咖啡实验室承载着对技术与生活的热情。用心做好每一件事，让微小的改变慢慢汇聚。</p></div><div className="home-photo-grid">{[1,2,3].map(n => <img key={n} src={`/images/about/${n}.jpeg`} alt={`老吴的生活记录 ${n}`} width={600} height={600} loading="lazy"/>)}</div><div className="home-about-bottom"><span>生活的美好，就是美好的生活。</span><a href={`mailto:${contact.email}`} className="home-text-link">聊一聊 <span aria-hidden="true">↗</span></a></div></div></section>;
}
