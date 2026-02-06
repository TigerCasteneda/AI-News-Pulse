
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

  const prompt = `Perform a high-precision search for the ${filters.itemCount} most recent and relevant news stories about AI.
  Query: "${keywords}"
  
  CRITICAL SEARCH LOGIC: 
  - Interpret "AND", "OR", "NOT" as Boolean operators. 
  - Respect grouping if parentheses are used.
  - Focus on results from: ${dateStr}.${sourceConstraint}
  
  For EACH news item (exactly ${filters.itemCount} items), provide the information AND an influence/geographic analysis in the following EXACT format:
  ITEM_START
  TITLE: [The headline]
  SUMMARY: [A 2-sentence summary]
  URI: [The most relevant source URL]
  SOURCE_NAME: [Identify the media outlet or author name]
  SOURCE_TYPE: [Choose exactly one: Top-tier Media, Research Institution, KOL / Industry Expert, General Source]
  DISSEMINATION: [Choose exactly one: Niche, Growing, Widespread, Global]
  IMPACT_SCORE: [A number from 0 to 100 based on the technological or market significance]
  GEOGRAPHY: [Specific city/country mentioned OR "Global" if multiple/none]
  LAT_LNG: [Latitude, Longitude of the geography, e.g. 37.7749, -122.4194. Use 0,0 for Global]
  ITEM_END

  Categorize source authority and dissemination breadth objectively.`;

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
    
    const blocks = text.split('ITEM_START');
    blocks.forEach((block, index) => {
      if (!block.trim() || !block.includes('ITEM_END')) return;
      
      const titleMatch = block.match(/TITLE:\s*(.*)/);
      const summaryMatch = block.match(/SUMMARY:\s*(.*)/);
      const uriMatch = block.match(/URI:\s*(.*)/);
      const sourceNameMatch = block.match(/SOURCE_NAME:\s*(.*)/);
      const sourceTypeMatch = block.match(/SOURCE_TYPE:\s*(.*)/);
      const disseminationMatch = block.match(/DISSEMINATION:\s*(.*)/);
      const impactScoreMatch = block.match(/IMPACT_SCORE:\s*(\d+)/);
      const geoMatch = block.match(/GEOGRAPHY:\s*(.*)/);
      const latLngMatch = block.match(/LAT_LNG:\s*([-.\d]+),\s*([-.\d]+)/);
      
      if (titleMatch && summaryMatch) {
        const score = impactScoreMatch ? parseInt(impactScoreMatch[1]) : 50;
        const lat = latLngMatch ? parseFloat(latLngMatch[1]) : 0;
        const lng = latLngMatch ? parseFloat(latLngMatch[2]) : 0;
        const geoName = geoMatch ? geoMatch[1].trim() : 'Global';

        items.push({
          id: `item-${Date.now()}-${index}`,
          title: titleMatch[1].trim(),
          summary: summaryMatch[1].trim(),
          uri: uriMatch ? uriMatch[1].trim() : '',
          sourceName: sourceNameMatch ? sourceNameMatch[1].trim() : 'Unknown Source',
          sourceType: (sourceTypeMatch ? sourceTypeMatch[1].trim() : 'General Source') as any,
          disseminationLevel: (disseminationMatch ? disseminationMatch[1].trim() : 'Growing') as any,
          influenceScore: score,
          isHighImpact: score > 80,
          location: geoName !== 'Global' ? {
            name: geoName,
            lat: lat,
            lng: lng,
            countryCode: 'XX'
          } : undefined
        });
      }
    });

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
      items: items.slice(0, filters.itemCount), 
      sources: uniqueSources.slice(0, 15)
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
