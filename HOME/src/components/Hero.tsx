export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark"
    >
      {/* Background video */}
      <video
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        poster="/images/hero-bg.jpg"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
        <source src="/videos/hero.webm" type="video/webm" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-[1]" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl animate-fade-in-up">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          你好，老吴咖啡
        </h1>
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
          <span className="text-3xl text-white font-bold">LW</span>
        </div>
        <p className="text-lg md:text-xl text-white/80 leading-relaxed">
          生活的美好就是美好的生活
        </p>
        <p className="text-base text-white/60 mt-4">
          至少理想还在，我还能在这里，讲着我的故事，刚好你也在听
        </p>
        <a
          href="#services"
          className="inline-block mt-10 px-8 py-3 bg-primary hover:bg-primary-light text-white rounded-full transition font-medium"
        >
          了解更多
        </a>
      </div>
    </section>
  );
}
