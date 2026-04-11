import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MODELS = ["gemini-3.1-flash-lite-preview","gemini-3-flash-preview","gemini-3.1-flash-live-preview","gemini-2.5-flash","gemini-2.5-flash-lite","gemini-2.0-flash"]; 

const prompt = `
  Analyze this receipt image and extract the following information in JSON format:
  - Total amount (just the number)
  - Date (in ISO format)
  - Description or items purchased (brief summary)
  - Merchant/store name
  - Suggested category (one of: housing, transportation, groceries, utilities,
    entertainment, food, shopping, healthcare, education, personal, travel,
    insurance, gifts, bills, other-expense)
  
  Only respond with valid JSON in this exact format:
  {
    "amount": number,
    "date": "ISO date string",
    "description": "string",
    "merchantName": "string",
    "category": "string"
  }
  If it's not a receipt, return an empty object {}.
`;


async function generateWithFallback(ai, base64String, mimeType) {
  for (const model of MODELS) {
    const RETRIES = 2;
    for (let attempt = 1; attempt <= RETRIES; attempt++) {
      try {
        console.log(`Trying model: ${model} (attempt ${attempt})`);
        const result = await ai.models.generateContent({
          model,
          contents: [
            { inlineData: { mimeType, data: base64String } },
            { text: prompt },
          ],
        });
        return result; 
      } catch (err) {
        const is503 = err?.status === 503 || err?.message?.includes("503");
        const isLast = attempt === RETRIES && model === MODELS[MODELS.length - 1];

        if (is503 && !isLast) {
          const wait = attempt * 1500; 
          console.warn(`503 on ${model} attempt ${attempt}, retrying in ${wait}ms...`);
          await new Promise((r) => setTimeout(r, wait));
          continue;
        }
        if (is503) break; 
        throw err; 
      }
    }
  }
  throw new Error("All Gemini models are currently unavailable. Please try again later.");
}

export async function POST(request) {
  console.log("Working......................")

  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("image");
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const base64String = Buffer.from(arrayBuffer).toString("base64");


  const uploadResult = await cloudinary.uploader.upload(
    `data:${file.type};base64,${base64String}`,
    { folder: "receipts" }
  );
  const imageUrl = uploadResult.secure_url;


  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  let result;
  try {
    result = await generateWithFallback(ai, base64String, file.type);
  } catch (err) {
    console.error("Gemini failed:", err.message);
    return NextResponse.json({ error: err.message }, { status: 503 });
  }

  const text = result.text;
  console.log("Raw Gemini response:", text);
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

  try {
    const data = JSON.parse(cleanedText);

    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Not a valid receipt" }, { status: 422 });
    }

    const dbUser = await prisma.user.findUnique({ where: { clerkuserID: clerkId } });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const receipt = await prisma.receipt.create({
  data: {
    amount:      parseFloat(data.amount),
    date:        new Date(data.date ?? Date.now()),
    description: data.description,
    category:    data.category,
    merchant:    data.merchantName, 
    imageUrl,
    userId:      dbUser.id,
  },
});

    return NextResponse.json(receipt);

  } catch (parseError) {
    console.error("Error parsing JSON response:", parseError);
    return NextResponse.json({ error: "Invalid response format from Gemini" }, { status: 500 });
  }
}