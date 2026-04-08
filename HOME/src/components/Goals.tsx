export default function Goals() {
  return (
    <section id="goals" className="py-24 bg-light">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
          目标
        </h2>
        <div className="divider mb-6" />
        <p className="text-muted text-lg max-w-2xl mx-auto mb-16">
          让我们的斜眼笑能够给大家带来更多快乐，总有一天我希望我能够通过某一种方式改变这个世界。
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              num: "01",
              title: "建立完善的服务体系",
              desc: "打造从网站到移动应用的完整数字化服务平台，让技术触手可及。",
            },
            {
              num: "02",
              title: "连接更多志同道合的人",
              desc: "通过内容推送和社区互动，汇聚有共同理想的伙伴。",
            },
            {
              num: "03",
              title: "持续学习与成长",
              desc: "不断探索新技术、新可能，用实践推动进步。",
            },
            {
              num: "04",
              title: "回馈社会",
              desc: "用所学所得，为需要帮助的人提供力所能及的支持。",
            },
          ].map((g) => (
            <div
              key={g.num}
              className="text-left p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow"
            >
              <span className="text-5xl font-bold text-primary/20">
                {g.num}
              </span>
              <h3 className="text-xl font-semibold text-dark mt-2 mb-3">
                {g.title}
              </h3>
              <p className="text-muted">{g.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
