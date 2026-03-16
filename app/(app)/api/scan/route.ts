import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { image, lang } = await req.json();
    if (!image) {
      return Response.json({ error: "No image provided" }, { status: 400 });
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = lang === "en"
      ? `You are an expert construction site safety inspector. Analyze this photo of a construction site and identify 2-5 specific safety risks or hazards visible in the image. Focus on real, observable dangers like: missing PPE, fall hazards, electrical risks, unstable structures, improper storage, blocked exits, etc. Return ONLY a JSON object with a "risks" key containing an array of short risk descriptions (max 15 words each). Example: {"risks":["Worker without hard hat near overhead crane","Unsecured ladder on uneven surface"]}`
      : `Tu es un inspecteur expert en sécurité de chantier de construction. Analyse cette photo d'un chantier et identifie 2 à 5 risques ou dangers spécifiques visibles dans l'image. Concentre-toi sur les dangers réels et observables : EPI manquants, risques de chute, risques électriques, structures instables, entreposage inadéquat, sorties bloquées, etc. Retourne UNIQUEMENT un objet JSON avec une clé "risks" contenant un tableau de courtes descriptions de risques (max 15 mots chacune). Exemple: {"risks":["Travailleur sans casque près d'une grue","Échelle non sécurisée sur surface inégale"]}`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data,
        },
      },
    ]);

    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return Response.json({ risks: ["Analyse non disponible"] });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return Response.json({ risks: parsed.risks || [] });
  } catch (e) {
    console.error("Scan error:", e);
    return Response.json({ risks: ["Erreur lors de l'analyse"] }, { status: 500 });
  }
}
