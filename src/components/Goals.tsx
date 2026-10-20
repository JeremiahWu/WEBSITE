const goals = [
  { title: "建立完善的服务体系", desc: "打造从桌面到移动应用的数字化服务平台，让技术触手可及。" },
  { title: "连接志同道合的人", desc: "通过内容分享与交流，遇见有共同理想的伙伴。" },
  { title: "持续学习与成长", desc: "不断探索新技术、新可能，用实践推动进步。" },
  { title: "回馈社会", desc: "用所学所得，为需要帮助的人提供力所能及的支持。" },
];
export default function Goals() {
  return <section id="goals" className="home-section home-goals"><div className="home-container"><div className="home-section-heading"><div><p className="home-eyebrow">LOOKING FORWARD</p><h2>一步一步。<br/><span>向理想靠近。</span></h2></div><p>让我们的斜眼笑带来更多快乐，<br/>也让每一次实践带来一点改变。</p></div><div className="home-goal-grid">{goals.map((goal, i) => <article key={goal.title}><span className="home-goal-number">0{i + 1}</span><h3>{goal.title}</h3><p>{goal.desc}</p></article>)}</div></div></section>;
}
