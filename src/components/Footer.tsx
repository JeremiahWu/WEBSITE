import { contact } from "@/config/contact";
import BrandLogo from "@/components/BrandLogo";
export default function Footer() {
  return <footer className="home-footer"><div className="home-container"><div className="home-footer-top"><div><a href="/#hero" className="home-brand" aria-label="回到首页顶部"><BrandLogo variant="footer" /></a><p>老吴咖啡实验室<br/>生活的美好就是美好的生活</p></div><div><h2>保持联系</h2><a className="home-email" href={`mailto:${contact.email}`}>{contact.email}</a><p>广东省深圳市光明区凤凰街道科林路3号<br/>电话：+852 47104992</p></div><div className="home-social"><div><img src="/images/qr.jpg" alt="微信公众号二维码" width={88} height={88} loading="lazy"/><span>微信公众号</span></div></div></div><div className="home-footer-bottom"><span>© 2013–{new Date().getFullYear()} 老吴咖啡实验室 LAOWU-CAFE Labs</span><a href="/#hero">回到顶部 ↑</a></div></div></footer>;
}
