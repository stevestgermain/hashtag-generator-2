import { GoogleGenAI, Type, Schema } from "@google/genai";
import { HashtagResult } from "../types";

// Helper function to safely find the API key.
// We check each variable explicitly (statically) so bundlers like Vite and Webpack
// can perform build-time string replacement.
const getApiKey = (): string => {
  let key = '';

  // 1. Check Vite-specific (import.meta.env)
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      if (import.meta.env.VITE_API_KEY) key = import.meta.env.VITE_API_KEY;
      // @ts-ignore
      else if (import.meta.env.API_KEY) key = import.meta.env.API_KEY;
    }
  } catch (e) {
    // Ignore errors if import.meta is not defined
  }

  // 2. If no key found yet, check standard process.env
  // We use individual try/catches to prevent ReferenceErrors if 'process' is undefined
  if (!key) {
    try {
      // @ts-ignore
      if (process.env.REACT_APP_API_KEY) key = process.env.REACT_APP_API_KEY;
    } catch (e) {}
  }
  
  if (!key) {
    try {
      // @ts-ignore
      if (process.env.NEXT_PUBLIC_API_KEY) key = process.env.NEXT_PUBLIC_API_KEY;
    } catch (e) {}
  }

  if (!key) {
    try {
      // @ts-ignore
      if (process.env.API_KEY) key = process.env.API_KEY;
    } catch (e) {}
  }

  return key;
};

const apiKey = getApiKey();

// Initialize with the found key (or a placeholder to prevent immediate crash)
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });

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
  // Runtime check: If the key is still missing, throw a helpful error.
  if (!apiKey || apiKey === 'dummy-key') {
    console.error("Debug: Environment variables checked. None found.");
    throw new Error(
      "API Key is missing. The app checked for 'VITE_API_KEY', 'REACT_APP_API_KEY', and 'API_KEY'. None were found. Please check your Vercel Project Settings > Environment Variables."
    );
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
    if (error instanceof Error) throw error;
    throw new Error("An unexpected error occurred while generating hashtags.");
  }
};