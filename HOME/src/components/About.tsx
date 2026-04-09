export default function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
          关于老吴同志
        </h2>
        <div className="divider mb-10" />

        <p className="text-muted text-lg leading-relaxed max-w-2xl mx-auto mb-12">
          一个热爱技术、热爱生活的人。从库尔勒到厦门，从代码到咖啡，
          老吴咖啡实验室承载着对技术与生活的热情。我们相信，用心做好每一件事，
          终将汇聚成改变世界的力量。
        </p>

        <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
          {[1, 2, 3].map((n) => (
            <img
              key={n}
              src={`/images/about/${n}.jpeg`}
              alt={`关于我们 ${n}`}
              className="aspect-square rounded-xl object-cover"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
