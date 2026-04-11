import { NextRequest, NextResponse } from "next/server";

// ← New URL format for HuggingFace Inference Providers
const HF_MODEL = "linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification";
const HF_API_URL = `https://router.huggingface.co/hf-inference/models/${HF_MODEL}`;
const HF_TOKEN = process.env.HF_TOKEN;

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!HF_TOKEN) {
        console.error("❌ HF_TOKEN missing");
        return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log("📤 Sending to HuggingFace, size:", buffer.length);

    let response: Response;
    try {
        response = await fetch(HF_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/octet-stream",
            },
            body: buffer,
            signal: AbortSignal.timeout(60000), // 60 seconds
        });
    } catch (err) {
        console.error("Fetch failed:", err);
        return NextResponse.json({ error: "Could not reach HuggingFace" }, { status: 500 });
    }

    const rawText = await response.text();
    console.log("📥 Status:", response.status);
    console.log("📥 Response:", rawText);

    if (response.status === 503) {
        return NextResponse.json(
            { error: "Model is loading, please wait 20 seconds and try again" },
            { status: 503 }
        );
    }

    if (!response.ok) {
        return NextResponse.json(
            { error: `HuggingFace error ${response.status}: ${rawText}` },
            { status: response.status }
        );
    }

    let hfResult: any;
    try {
        hfResult = JSON.parse(rawText);
    } catch {
        return NextResponse.json({ error: "Invalid response from model" }, { status: 500 });
    }

    if (!Array.isArray(hfResult)) {
        return NextResponse.json(
            { error: hfResult?.error ?? "Unexpected response format" },
            { status: 500 }
        );
    }

    const top3 = hfResult.slice(0, 3).map((item: any) => {
        const parts = item.label.split("___");
        const plant = parts[0]?.replace(/_/g, " ") ?? item.label;
        const disease = parts[1]?.replace(/_/g, " ") ?? "Unknown";
        return {
            plant,
            disease,
            confidence: Math.round(item.score * 10000) / 100,
        };
    });

    return NextResponse.json({
        prediction: top3[0].disease,
        plant: top3[0].plant,
        confidence: top3[0].confidence,
        is_healthy: top3[0].disease.toLowerCase().includes("healthy"),
        top3,
    });
}