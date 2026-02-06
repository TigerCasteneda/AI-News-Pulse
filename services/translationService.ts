
import { NewsItem, LanguageCode } from "../types";
import { CONFIG } from "../config";

/**
 * Translates a list of news items using the Qwen model via OpenRouter.
 */
export async function translateArticles(
  items: NewsItem[], 
  targetLang: LanguageCode
): Promise<Record<string, { title: string; summary: string }>> {
  
  if (!CONFIG.QWEN.API_KEY || CONFIG.QWEN.API_KEY.includes('YOUR_QWEN_API_KEY')) {
    console.warn("API key is not configured correctly.");
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

  const prompt = `Translate the following AI news items into ${langNames[targetLang]}. 
Maintain a professional tone. Return ONLY a JSON object.

Format:
{
  "translations": [
    { "id": "original_id", "title": "translated_title", "summary": "translated_summary" }
  ]
}

Items:
${items.map((item) => `[ID: ${item.id}] TITLE: ${item.title}\nSUMMARY: ${item.summary}`).join('\n\n')}`;

  try {
    const response = await fetch(`${CONFIG.QWEN.BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.QWEN.API_KEY}`,
        'Content-Type': 'application/json',
        // Required for OpenRouter
        'HTTP-Referer': window.location.origin,
        'X-Title': 'AI News Pulse'
      },
      body: JSON.stringify({
        model: CONFIG.QWEN.MODEL,
        messages: [
          { role: 'system', content: 'You are a professional translator that strictly outputs JSON.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices[0]?.message?.content;
    
    if (!content) throw new Error("Empty response from API");

    // Robust JSON extraction: remove markdown backticks if present
    content = content.replace(/^```json\s*|```\s*$/g, '').trim();

    const result = JSON.parse(content);
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
    console.error("Translation Engine Error:", error);
    // Return empty map so UI doesn't crash, but shows English fallback
    return {};
  }
}
