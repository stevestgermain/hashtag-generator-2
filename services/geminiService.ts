import { GoogleGenAI, Type, Schema } from "@google/genai";
import { HashtagResult } from "../types";

// Robustly attempt to retrieve the API Key from various environment variable patterns.
// This handles Vite (import.meta.env), CRA (process.env.REACT_APP_), and standard Node/Next.js (process.env).
let apiKey = '';

try {
  // 1. Try Vite-style import.meta.env
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore
    apiKey = import.meta.env.VITE_API_KEY || import.meta.env.API_KEY;
  }

  // 2. If not found, try process.env (Standard, CRA, Next.js)
  // @ts-ignore
  if (!apiKey && typeof process !== 'undefined' && process.env) {
    // @ts-ignore
    apiKey = process.env.API_KEY || process.env.REACT_APP_API_KEY || process.env.VITE_API_KEY || process.env.NEXT_PUBLIC_API_KEY;
  }
} catch (e) {
  console.warn("Could not read environment variables:", e);
}

// Initialize the AI client
// Note: We initialize this lazily with a fallback to ensure the app doesn't crash on load.
// The real check happens inside generateHashtags.
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-init' });

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
  // Check specifically for the key here to provide a helpful error message at runtime
  if (!apiKey || apiKey === 'dummy-key-for-init') {
    throw new Error(
      "API Key is missing. Please set 'VITE_API_KEY' (for Vite) or 'REACT_APP_API_KEY' (for Create React App) in your Vercel Environment Variables and REDEPLOY."
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