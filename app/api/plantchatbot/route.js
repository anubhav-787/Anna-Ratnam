import { GoogleGenAI } from "@google/genai";
import { syncCurrentuser } from "@/lib/sync-user";



const MODELS = ["gemini-3.1-flash-lite-preview","gemini-3-flash-preview","gemini-3.1-flash-live-preview","gemini-2.5-flash","gemini-2.5-flash-lite","gemini-2.0-flash"]; 

const json = (data, status = 200) => Response.json(data, { status });

export async function POST(req) {
  try {
    const user = await syncCurrentuser();
    if (!user) return json({ reply: "Unauthorized" }, 401);

    const { result, plantname } = await req.json();

    const predictedDisease = result?.prediction ?? "Unknown Disease";
    const detectedPlant    = result?.plant ?? plantname ?? "Unknown Plant";

    let rawConfidence = result?.confidence ?? 0;
    const confidenceDisplay = rawConfidence > 1
      ? `${rawConfidence.toFixed(2)} (raw score — apply softmax on model side)`
      : `${(rawConfidence * 100).toFixed(2)}%`;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
You are an AI assistant for the "Anna Ratnam", helping Indian farmers with crop disease management.

Rules:
- Only answer farming-related questions.
- If asked anything outside farming, politely say: "I can only help with farming-related questions."
- Give practical, actionable advice relevant to Indian farming conditions.
- Write in simple language that a farmer can understand.
- Structure your response clearly with headings where helpful.

Crop Analysis Result:
- Plant name (entered by user): ${plantname || detectedPlant}
- Plant detected by ML model:   ${detectedPlant}
- Disease detected by ML model: ${predictedDisease}
- Model confidence:             ${confidenceDisplay}

Task:
Please advise the farmer about "${predictedDisease}" affecting "${plantname || detectedPlant}".
Your response must include:
1. Brief description of the disease and its causes
2. Key symptoms to look for on the plant
3. Immediate treatment steps (organic and chemical options)
4. Preventive measures for the next season
5. Any India-specific tips (locally available remedies, government schemes if relevant)
6. Reply in language according to plantname's language preference (Hindi, Malayalam, or English). If unsure, default to English.
    `.trim();

    for (const model of MODELS) {
      try {
        const { text } = await ai.models.generateContent({ model, contents: prompt });
        return json({ reply: text });
      } catch (err) {
        if (err?.status === 429 || err?.status === 503) {
          console.warn(`Model ${model} unavailable (${err.status}), trying next...`);
          continue; 
        }
        throw err; 
      }
    }


    return json({ reply: "Our AI assistant is temporarily unavailable. Please try again in a few minutes." });

  } catch (error) {
    console.error("API ERROR:", error);
    return json({ reply: "Sorry, something went wrong. Please try again." });
  }
}
