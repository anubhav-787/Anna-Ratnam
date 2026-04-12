import { GoogleGenAI } from "@google/genai";
import { syncCurrentuser } from "@/lib/sync-user";
import { prisma } from "@/lib/prisma";

const MODELS = ["gemini-3.1-flash-lite-preview","gemini-3-flash-preview","gemini-3.1-flash-live-preview","gemini-2.5-flash","gemini-2.5-flash-lite","gemini-2.0-flash"]; 

export async function POST(req) {
  try {
    const user = await syncCurrentuser();
    if (!user) {
      return Response.json({ reply: "Unauthorized" }, { status: 401 });
    }

    const { message, langPref } = await req.json();

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    let languagepref = "";
    if (langPref == "en") languagepref = "Answer in Simple English";
    if (langPref == "hi") languagepref = "Answer in Simple Hindi";
    if (langPref == "ml") languagepref = "Answer in Simple Malayalam";

    const prompt = `
You are an AI assistant for "Anna Ratnam ".

- Help Indian farmers
- Do not give answer for question out of scope of farming and if someone asks a question out of scope then answer them: I can only answer farming related questions
- Give practical farming advice
${languagepref}
User question: ${message}
    `;


    let replychat = null;
    let usedModel = null;

    for (const model of MODELS) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
        });
        replychat = response.text;
        usedModel = model;
        break; 
      } catch (modelError) {
        console.warn(`Model "${model}" failed:`, modelError.message);
       
      }
    }

    if (!replychat) {
      return Response.json({ reply: "All models failed. Please try again later." });
    }

    console.log(`Responded using model: ${usedModel}`);

    await prisma.chat.create({
      data: {
        userId: user.id,
        userMessage: message,
        reply: replychat,
        language: langPref,
      },
    });

    return Response.json({ reply: replychat });

  } catch (error) {
    console.error("API ERROR:", error);
    return Response.json({ reply: "Error occurred" });
  }
}
