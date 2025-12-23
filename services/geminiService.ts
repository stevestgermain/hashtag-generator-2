import { GoogleGenAI, Type, Schema } from "@google/genai";
import { HashtagResult } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    items: {
      type: Type.ARRAY,
      description: "A ranked list of exactly 5 hashtags.",
      items: {
        type: Type.OBJECT,
        properties: {
          tag: {
            type: Type.STRING,
            description: "The hashtag text without the # symbol."
          },
          category: {
            type: Type.STRING,
            enum: ["Niche", "Broad", "Related"],
            description: "The classification of the hashtag."
          },
          reach: {
            type: Type.STRING,
            description: "Estimated reach/volume formatted as a string (e.g., '10k', '1.5M')."
          },
          relevance: {
            type: Type.NUMBER,
            description: "Relevance score from 1-100."
          }
        },
        required: ["tag", "category", "reach", "relevance"]
      }
    }
  },
  required: ["items"]
};

export const generateHashtags = async (description: string): Promise<HashtagResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const prompt = `
    Analyze the following content description and generate the ultimate "Recommended Mix" of hashtags.
    
    Content Description: "${description}"
    
    Rules:
    1. Generate exactly 5 hashtags. No more, no less.
    2. These must be the absolute best balance of Niche (specific), Broad (high volume), and Related terms.
    3. Sort them by highest impact potential.
    4. Estimate the "Reach" (volume of usage) realistically (e.g., 5k, 200k, 5M).
    5. Categorize each strictly as 'Niche', 'Broad', or 'Related'.
    6. Do not include the '#' symbol in the tag string.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "You are an expert social media strategist. You believe in quality over quantity. You provide a curated mix of 5 tags."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as HashtagResult;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};