export const research = {
  ai: {
    name: "人工智能研究", english: "AI Research", number: "01", theme: "ai",
    headline: ["让智能，", "走进真实的问题。"],
    intro: "从语言模型到场景应用，探索智能如何理解、协作，并成为创造力的一部分。",
    statement: "从模型出发。\n向应用深入。",
    overview: "以自有算力资源为基础，围绕大语言模型的训练、优化与应用展开研究。关注模型能力，也关注它在实际任务中的表现，让研究与真实需求保持连接。",
    features: [
      { label: "MODEL", title: "理解语言，连接知识。", text: "探索大语言模型的训练与优化，围绕具体领域梳理知识、组织语境，研究更符合任务需求的模型能力。" },
      { label: "PRODUCTIVITY", title: "把精力，留给创造。", text: "面向信息整理、内容辅助与工作流协作，探索人工智能融入日常生产力工具的方式。" },
      { label: "EMBODIED AI", title: "智能，不止于屏幕。", text: "将模型研究延伸至具身智能场景，探索语言、感知与动作之间的联系，让智能与物理世界产生交互。" },
    ],
    closing: "让每一次探索，\n更接近实际价值。",
  },
  robotics: {
    name: "具身智能", english: "Robotics", number: "02", theme: "robotics",
    headline: ["理解世界。", "也行动其中。"],
    intro: "从轮式机器人到机械臂，连接本体、感知与控制，探索智能在物理世界中的更多可能。",
    statement: "感知。决策。行动。\n在一个系统里相遇。",
    overview: "围绕轮式机器人与机械臂两种范式，开展从本体设计到算法研究的系统探索。让结构、运动与环境理解相互配合，逐步构建完整的机器人能力。",
    features: [
      { label: "HARDWARE", title: "从本体，开始思考。", text: "关注机械结构、电子系统与软件之间的协同，围绕移动与操作需求，探索机器人本体的全链路设计开发。" },
      { label: "PERCEPTION", title: "看见环境，找到方向。", text: "研究环境感知与 SLAM 算法，探索定位、建图和空间理解，为机器人在真实环境中移动提供基础。" },
      { label: "CONTROL", title: "让每一步，都有回应。", text: "围绕轮式运动与机械臂操作研究控制算法，将感知信息与动作执行连接起来，探索稳定、协调的系统表现。" },
    ],
    closing: "从一个动作，\n走向更多可能。",
  },
  xr: {
    name: "下一代个人终端", english: "Next-Gen XRs", number: "03", theme: "xr",
    headline: ["视野之外，", "是交互的新空间。"],
    intro: "以头戴式显示器为起点，探索虚拟现实、增强现实与混合现实，让数字体验走向更广阔的空间。",
    statement: "打开视野。\n重新想象个人终端。",
    overview: "我们相信，头戴式显示器（HMD）为未来人机交互提供了值得探索的方向。通过硬件设计与软件优化的共同研究，思考下一代个人终端的体验与形态。",
    features: [
      { label: "HARDWARE", title: "体验，从佩戴开始。", text: "围绕头戴式终端的硬件形态展开探索，关注设备、显示与人的关系，让交互体验从使用的第一刻开始被考虑。" },
      { label: "SPATIAL", title: "内容，有了空间感。", text: "探索 VR、AR 与 MR 的不同体验方式，思考数字内容如何融入空间，以及虚拟信息如何与真实环境建立联系。" },
      { label: "INTERACTION", title: "交互，走向更自然。", text: "结合软件优化与场景设计，研究适合空间体验的界面与操作方式，探索个人终端在人机协作中的新可能。" },
    ],
    closing: "下一种日常，\n从新的视角开始。",
  },
} as const;

export type ResearchSlug = keyof typeof research;
