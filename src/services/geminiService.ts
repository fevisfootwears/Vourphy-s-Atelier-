import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Using stable multimodal models
const FLASH_MODEL = "gemini-flash-latest"; // This is consistently stable for multimodal
const PRO_MODEL = "gemini-3.1-pro-preview";

export async function identifyFootwear(base64Image: string) {
  try {
    // Extract mime type and data from data URL
    let mimeType = "image/jpeg";
    let base64Data = base64Image;

    if (base64Image.startsWith('data:')) {
      const parts = base64Image.split(';base64,');
      if (parts.length === 2) {
        mimeType = parts[0].split(':')[1] || "image/jpeg";
        base64Data = parts[1];
      }
    }

    // Try primary high-speed identification with correct SDK usage
    const model = ai.getGenerativeModel({ model: FLASH_MODEL });
    const response = await model.generateContent({
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data,
              },
            },
            {
              text: "Analyze this luxury footwear image. Suggest a professional name, a brief artisan description, and a suggested category tag. Return ONLY a valid JSON object like this: {\"name\": \"...\", \"description\": \"...\", \"suggestedTag\": \"...\"}",
            },
          ],
        },
      ],
    });

    const result = response.response;
    const text = result.text();
    if (!text) {
      console.warn("Gemini response was empty, attempting fallback...");
      return await rawIdentificationFallback(base64Image);
    }

    try {
      // Clean up potential markdown formatting if model returned it
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return await rawIdentificationFallback(base64Image);
    } catch (parseError) {
      console.error("Failed to parse Gemini JSON, attempting fallback...");
      return await rawIdentificationFallback(base64Image);
    }
  } catch (error) {
    console.error("Gemini identifying footwear error:", error);
    // Explicitly handle the INVALID_ARGUMENT or other 400 errors
    return await rawIdentificationFallback(base64Image);
  }
}

async function rawIdentificationFallback(base64Image: string) {
  try {
    let base64Data = base64Image;
    let mimeType = "image/jpeg";
    if (base64Image.startsWith('data:')) {
      const parts = base64Image.split(';base64,');
      base64Data = parts[1] || base64Image;
      mimeType = parts[0].split(':')[1] || "image/jpeg";
    }

    // fallback using Pro model which is more robust
    const model = ai.getGenerativeModel({ model: PRO_MODEL });
    const response = await model.generateContent({
      contents: [
        {
          parts: [
            { inlineData: { mimeType, data: base64Data } },
            { text: "What is this? Return name and description in JSON: {\"name\": \"...\", \"description\": \"...\", \"suggestedTag\": \"NEW ARRIVAL\"}" }
          ]
        }
      ]
    });

    const result = response.response;
    const text = result.text() || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return { name: "Bespoke Creation", description: "Hand-crafted excellence from the Vourphy's Atelier.", suggestedTag: "NEW ARRIVAL" };
  } catch (error) {
    console.error("Critical AI Fallback failed:", error);
    return { name: "Handcrafted Luxury", description: "Meticulously crafted for the discerning individual.", suggestedTag: "NEW ARRIVAL" };
  }
}
