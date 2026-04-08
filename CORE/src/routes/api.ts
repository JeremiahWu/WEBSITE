import { Router, Request, Response } from "express";

export const apiRouter = Router();

// --- API index ---
apiRouter.get("/", (_req: Request, res: Response) => {
  res.json({
    service: "LABSOFT Core API",
    version: "1.0.0",
    endpoints: {
      "GET  /api/services": "List all services",
      "GET  /api/about": "About info",
      "POST /api/contact": "Submit contact form",
      "GET  /api/goals": "Project goals",
    },
  });
});

// --- Services ---
const services = [
  {
    id: 1,
    title: "微信号推送",
    description: "每周一篇文章推送，文章主要是工作学习生活中的点滴。",
    icon: "pencil",
  },
  {
    id: 2,
    title: "计算机网络服务",
    description: "远程技术支持，原版系统安装及工作软件配置。",
    icon: "settings",
  },
  {
    id: 3,
    title: "网站经营",
    description: "下载中心、数据监控中心等在线服务平台。",
    icon: "globe",
  },
];

apiRouter.get("/services", (_req: Request, res: Response) => {
  res.json({ data: services });
});

// --- About ---
apiRouter.get("/about", (_req: Request, res: Response) => {
  res.json({
    data: {
      name: "老吴咖啡实验室",
      nameEn: "LABSOFT",
      tagline: "老吴同志在看着你",
      description:
        "一个热爱技术、热爱生活的人。从库尔勒到厦门，从代码到咖啡，老吴咖啡实验室承载着对技术与生活的热情。",
      contact: {
        address: "福建省厦门市集美区",
        email: "wuruihao629@laowu-cafe.com",
      },
    },
  });
});

// --- Contact form ---
apiRouter.post("/contact", (req: Request, res: Response) => {
  const { email, subject, message } = req.body;
  const errors: string[] = [];

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("请提供有效的邮箱地址");
  }
  if (!subject || subject.trim().length === 0) {
    errors.push("请填写主题");
  }
  if (!message || message.trim().length === 0) {
    errors.push("请填写消息内容");
  }

  if (errors.length > 0) {
    res.status(400).json({ success: false, errors });
    return;
  }

  // In production: send email, save to DB, etc.
  console.log(`[Contact] From: ${email}, Subject: ${subject}`);
  res.json({ success: true, message: "消息已发送，感谢您的反馈！" });
});

// --- Goals ---
const goals = [
  { id: 1, title: "建立完善的服务体系", description: "打造从网站到移动应用的完整数字化服务平台。" },
  { id: 2, title: "连接更多志同道合的人", description: "通过内容推送和社区互动，汇聚有共同理想的伙伴。" },
  { id: 3, title: "持续学习与成长", description: "不断探索新技术、新可能，用实践推动进步。" },
  { id: 4, title: "回馈社会", description: "用所学所得，为需要帮助的人提供力所能及的支持。" },
];

apiRouter.get("/goals", (_req: Request, res: Response) => {
  res.json({ data: goals });
});
