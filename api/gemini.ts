import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Vercel Serverless Function
 * POST /api/gemini
 * body: { question: string }
 *
 * Required env:
 *   - GEMINI_API_KEY
 * Optional env:
 *   - GEMINI_MODEL (default: gemini-1.5-flash)
 */

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method Not Allowed" });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: "Missing GEMINI_API_KEY on server" });
      return;
    }

    // ✅ Robust JSON parsing (works even if req.body is missing)
    let body = req.body;
    if (!body && req.headers["content-type"]?.includes("application/json")) {
      const buffers: any[] = [];
      for await (const chunk of req) buffers.push(chunk);
      body = JSON.parse(Buffer.concat(buffers).toString() || "{}");
    }

    const question = (body?.question ?? "").toString().trim();
    if (!question) {
      res.status(400).json({ error: "Missing question" });
      return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const system =
      "You are a document assistant for the South African IMPCG 2024 (maternal and perinatal care). " +
      "Answer by summarising guideline concepts at a high level. " +
      "Do NOT give personalised medical advice, diagnoses, or dosing for a specific patient. " +
      "Always remind the user to verify against the official guideline and local protocols.";

    const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
    const model = genAI.getGenerativeModel({ model: modelName });

    const result = await model.generateContent(`${system}\n\nQuestion: ${question}`);
    const text = result?.response?.text?.() ?? "";

    res.status(200).json({ text });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err?.message ?? "Server error" });
  }
}
