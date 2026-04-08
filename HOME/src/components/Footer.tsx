export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white">
      {/* Contact bar */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-10 text-center md:text-left">
          <div>
            <h3 className="font-bold text-lg mb-3">老吴咖啡实验室</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              LABSOFT - 软件基础服务
              <br />
              让技术与生活更美好
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-3">联系方式</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              福建省厦门市集美区
              <br />
              E-mail: wuruihao629@laowu-cafe.com
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-3">关注我们</h3>
            <p className="text-white/60 text-sm">
              微信公众号 &middot; QQ &middot; 微博
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 py-6 text-center text-white/40 text-sm">
        &copy; 2013-{year} 老吴咖啡实验室 LABSOFT
      </div>

      {/* Scroll to top */}
      <a
        href="#hero"
        className="fixed bottom-6 right-6 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-lg hover:bg-primary-light transition z-50"
        aria-label="回到顶部"
      >
        &#8593;
      </a>
    </footer>
  );
}
