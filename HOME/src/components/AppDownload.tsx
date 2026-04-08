const phases = [
  {
    title: "第一阶段（基础建设）",
    items: [
      "通过微信公众号推送，扩大老吴咖啡知名度",
      "连通库尔勒、厦门、深圳等地服务器",
      "提供网站搭载、SSL、数据监控等基础服务",
    ],
  },
  {
    title: "第二阶段（移动应用）",
    items: [
      "发布 iOS / Android 移动应用",
      "集成在线服务预约与支付",
      "数据监控仪表盘移动端适配",
    ],
  },
  {
    title: "第三阶段（生态完善）",
    items: [
      "开放 API 接口，支持第三方集成",
      "社区功能与用户互动体系",
      "持续迭代，打造完整服务生态",
    ],
  },
];

export default function AppDownload() {
  return (
    <section id="download" className="py-24 bg-light">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
            老吴咖啡移动应用
          </h2>
          <div className="divider" />
          <p className="text-muted mt-6 max-w-2xl mx-auto">
            专注于建立一套完整的网络系统，将各个节点全部打通，形成一条初具规模的产品线。
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {phases.map((p, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                  {i + 1}
                </span>
                <h3 className="text-lg font-semibold text-dark">{p.title}</h3>
              </div>
              <ul className="space-y-3">
                {p.items.map((item, j) => (
                  <li key={j} className="flex gap-2 text-muted">
                    <span className="text-primary mt-1 shrink-0">&#10003;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex gap-4">
            <span className="px-6 py-3 bg-primary/10 text-primary rounded-full font-medium">
              iOS - 即将推出
            </span>
            <span className="px-6 py-3 bg-primary/10 text-primary rounded-full font-medium">
              Android - 即将推出
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
