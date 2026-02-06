
import { GoogleGenAI, Type } from "@google/genai";
import { NewsItem, LanguageCode } from "../types";

/**
 * Translates news items using the Gemini API.
 * Uses the system-provided process.env.API_KEY.
 */
export async function translateArticles(
  items: NewsItem[], 
  targetLang: LanguageCode
): Promise<Record<string, { title: string; summary: string }>> {
  
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("Gemini API key is not configured for translation.");
    return {};
  }

  if (targetLang === 'en') return {};

  const langNames: Record<LanguageCode, string> = {
    en: 'English',
    zh: 'Chinese',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    ja: 'Japanese',
    ko: 'Korean'
  };

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Translate the following AI news items into ${langNames[targetLang]}. 
Maintain a professional and technical tone appropriate for AI news.
Items to translate:
${items.map((item) => `[ID: ${item.id}] TITLE: ${item.title}\nSUMMARY: ${item.summary}`).join('\n\n')}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            translations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  summary: { type: Type.STRING }
                },
                required: ["id", "title", "summary"]
              }
            }
          },
          required: ["translations"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    const translationMap: Record<string, { title: string; summary: string }> = {};
    
    if (result.translations && Array.isArray(result.translations)) {
      result.translations.forEach((t: any) => {
        translationMap[t.id] = { 
          title: t.title || "No Title", 
          summary: t.summary || "No Summary" 
        };
      });
    }

    return translationMap;
  } catch (error) {
    console.error("Gemini Translation Error:", error);
    return {};
  }
}
