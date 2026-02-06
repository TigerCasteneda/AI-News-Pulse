
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { NewsSource, GroundingChunk, NewsItem, SearchFilters } from "../types";

const MODEL_NAME = 'gemini-3-flash-preview';

export async function fetchAiNews(keywords: string, filters: SearchFilters): Promise<{ items: NewsItem[]; sources: NewsSource[] }> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const dateStr = filters.dateRange === '24h' ? 'within the last 24 hours' : 
                filters.dateRange === '7d' ? 'within the last 7 days' : 
                filters.dateRange === '30d' ? 'within the last 30 days' : 'recently';

  const sourceConstraint = filters.specificSource ? ` focusing strictly on news from ${filters.specificSource}` : '';

  const prompt = `Search for the 10 most recent and relevant news stories about AI related to: "${keywords}".
  Timeframe: ${dateStr}.${sourceConstraint}
  
  For EACH news item, provide the information in the following EXACT format:
  ITEM_START
  TITLE: [The headline]
  SUMMARY: [A 2-sentence summary]
  URI: [The most relevant source URL from your search results]
  ITEM_END

  Ensure exactly 10 items are returned if available. Be objective and technical.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    const items: NewsItem[] = [];
    
    // Parse the structured text
    const blocks = text.split('ITEM_START');
    blocks.forEach((block, index) => {
      if (!block.trim() || !block.includes('ITEM_END')) return;
      
      const titleMatch = block.match(/TITLE:\s*(.*)/);
      const summaryMatch = block.match(/SUMMARY:\s*(.*)/);
      const uriMatch = block.match(/URI:\s*(.*)/);
      
      if (titleMatch && summaryMatch) {
        items.push({
          id: `item-${Date.now()}-${index}`,
          title: titleMatch[1].trim(),
          summary: summaryMatch[1].trim(),
          uri: uriMatch ? uriMatch[1].trim() : ''
        });
      }
    });

    // Extract grounding sources for the "Verified Sources" section
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] | undefined;
    const sources: NewsSource[] = [];

    if (groundingChunks) {
      groundingChunks.forEach(chunk => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title || "News Source",
            uri: chunk.web.uri
          });
        }
      });
    }

    const uniqueSources = sources.filter((v, i, a) => a.findIndex(t => t.uri === v.uri) === i);

    return { 
      items: items.slice(0, 10), 
      sources: uniqueSources.slice(0, 15)
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
