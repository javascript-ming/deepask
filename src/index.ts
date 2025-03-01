/*
 * @Author       : yinming 1090538449@qq.com
 * @Date         : 2025-02-26 19:00
 * @LastEditors: XIAOLANHAI-Z2SFF\xiaolanhai wujixmm@gmail.com
 * @LastEditTime: 2025-03-01 16:17:13
 * @FilePath     : \deep_seek\src\index.ts
 * @Description  :  实现deepseek talk的api调用功能
 */
import express, { Request, Response, NextFunction } from "express";
import https from "https";
import cors from "cors";
import fs from "fs";
import { apiUrl, apiKey, sslConfig, port } from "../config/config.js";

import OpenAI from "openai";

interface ChatRequstDTO {
  message: string;
}
const openai = new OpenAI({
  baseURL: apiUrl,
  apiKey: apiKey,
});
const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
  {
    role: "system",
    content: "开始吧。",
  },
]; // 先以数组存储，再考虑数据库

const requestDeepSeek = async () => {
  try {
    const completions = await openai.chat.completions.create({
      messages,
      model: "deepseek-chat",
    });
    return completions.choices[0].message.content;
  } catch (error) {
    console.error("fetch deepseekAPI error:", error);
    throw error;
  }
};
const deepSeekChatMWbyPost = async (
  req: Request<object, object, ChatRequstDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { message } = req.body;
    console.log(message);
    if (typeof message !== "string") {
      res.status(400).json({ error: "请求参数 message 必须为字符串类型" });
      return;
    }
    if (!message || message.length === 0) {
      res.status(400).json({ error: "请求参数 message 不能为空" });
      return;
    }
    const curQuestion = (message as string) || "你好";
    messages.push({
      role: "user",
      content: curQuestion,
    });
    const response = await requestDeepSeek();
    res.locals.deepSeekResponse = response;
    next();
  } catch (error) {
    console.error("middleware deal dptalk error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const app = express();
const corsOption = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // 允许携带凭证（如 cookies）
  optionsSuccessStatus: 204,
};
app.use(cors(corsOption));

app.use(express.json());
app.get("/", async (req: Request, res: Response) => {
  try {
    // 修改为返回对象形式的 JSON 数据
    res.json({ message: "访问成功" });
  } catch (error) {
    console.error("请求出错:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/chat", deepSeekChatMWbyPost, async (req: Request, res: Response) => {
  try {
    const deepSeekResponse = res.locals.deepSeekResponse;
    if (deepSeekResponse) {
      res.json({ message: deepSeekResponse });
    }
  } catch (error) {
    console.error("请求出错:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 读取证书和私钥文件
// ts的路径别名只能ts编译阶段和代码编写的时候检测能生效

console.log("Resolved key path:", sslConfig.keyPath);
const options = {
  key: fs.readFileSync(sslConfig.keyPath, "utf-8"),
  cert: fs.readFileSync(sslConfig.certPath, "utf-8"),
};
// 创建 HTTPS 服务器
const server = https.createServer(options, app);

server.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
