import { GoogleGenAI } from '@google/genai';
import { getCategoryById } from '$lib/categories';
import { geminiFallbackModel, geminiImageModel, requireEnv } from '$lib/server/env';

export type GeneratedImage = {
  buffer: Buffer;
  mimeType: string;
};

function buildPrompt(categoryId: string): string {
  const category = getCategoryById(categoryId);
  const subject = category?.prompt ?? `something extremely cute related to ${categoryId}`;
  return `Wholesome, heartwarming, cute photograph: ${subject}. Soft colors, feel-good mood. No text, no watermarks, no logos, family-friendly.`;
}

function extractInlineImage(response: Awaited<ReturnType<GoogleGenAI['models']['generateContent']>>): GeneratedImage | null {
  for (const candidate of response.candidates ?? []) {
    for (const part of candidate.content?.parts ?? []) {
      if (part.inlineData?.data) {
        return {
          buffer: Buffer.from(part.inlineData.data, 'base64'),
          mimeType: part.inlineData.mimeType ?? 'image/png'
        };
      }
    }
  }
  return null;
}

export async function generateCuteImage(categoryId: string): Promise<GeneratedImage> {
  const apiKey = requireEnv('GEMINI_API_KEY');
  const ai = new GoogleGenAI({ apiKey });
  const prompt = buildPrompt(categoryId);

  try {
    const response = await ai.models.generateImages({
      model: geminiImageModel(),
      prompt,
      config: { numberOfImages: 1 }
    });

    const imageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    if (imageBytes) {
      return {
        buffer: Buffer.from(imageBytes, 'base64'),
        mimeType: 'image/png'
      };
    }
  } catch (error) {
    console.warn('Gemini generateImages failed, trying fallback model:', error);
  }

  const fallback = await ai.models.generateContent({
    model: geminiFallbackModel(),
    contents: prompt,
    config: { responseModalities: ['IMAGE'] }
  });

  const image = extractInlineImage(fallback);
  if (!image) {
    throw new Error('Gemini did not return an image.');
  }

  return image;
}
