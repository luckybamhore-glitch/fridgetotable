import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || '';
const isGeminiConfigured = Boolean(apiKey && apiKey !== 'your_gemini_api_key' && apiKey.length > 10);

let genAI = null;
if (isGeminiConfigured) {
  genAI = new GoogleGenerativeAI(apiKey);
  console.log('✅ Google Gemini API initialized successfully');
} else {
  console.log('ℹ️ GEMINI_API_KEY not configured. Running with AI intelligence engine fallbacks.');
}

// Ordered fallback chain — first working model wins. Override with GEMINI_MODEL env.
const MODEL_CHAIN = [
  process.env.GEMINI_MODEL,
  'gemini-3.8-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-2.5-flash',
  'gemini-flash-latest',
  'gemini-2.5-flash-lite'
].filter(Boolean);
const triedModels = new Set();

/**
 * Returns Gemini model instance for vision or text tasks
 * @param {string} modelName - e.g. 'gemini-2.5-flash'
 */
export const getGeminiModel = (modelName = MODEL_CHAIN[0]) => {
  if (!genAI) return null;
  try {
    return genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature: 0.4,
        topP: 0.95
      }
    });
  } catch (error) {
    console.error('Error initializing Gemini model:', error);
    return null;
  }
};

/**
 * Calls generateContent trying each model in the chain until one succeeds.
 * Retired/unknown model names (404) are skipped automatically.
 * @param {Array} parts - Gemini content parts (strings and/or inlineData image parts)
 * @returns {Promise<{ text: string, model: string }>}
 */
export const generateWithFallback = async (parts) => {
  if (!genAI) throw new Error('Gemini API not configured');
  let lastError = null;
  for (const modelName of MODEL_CHAIN) {
    try {
      const model = getGeminiModel(modelName);
      if (!model) continue;
      const result = await model.generateContent(parts);
      const text = result.response.text().trim();
      if (!text) throw new Error('Empty response from model');
      if (!triedModels.has(modelName)) {
        console.log(`✅ Gemini responding via model: ${modelName}`);
        triedModels.add(modelName);
      }
      return { text, model: modelName };
    } catch (err) {
      lastError = err;
      console.warn(`⚠️ Gemini model "${modelName}" failed: ${err.message} — trying next...`);
    }
  }
  throw lastError || new Error('All Gemini models failed');
};

/**
 * Extracts a JSON array from a model response that may contain
 * markdown fences, prose, or thinking artifacts.
 */
export const extractJsonArray = (raw) => {
  if (!raw) throw new Error('Empty model response');
  const attempts = [];
  let cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```[\s]*$/i, '')
    .trim();
  attempts.push(cleaned);
  const start = cleaned.indexOf('[');
  const end = cleaned.lastIndexOf(']');
  if (start !== -1 && end !== -1 && end > start) {
    attempts.push(cleaned.slice(start, end + 1));
  }
  let lastErr = null;
  for (const candidate of attempts) {
    const variants = [candidate, candidate.replace(/,\s*([}\]])/g, '$1')];
    for (const v of variants) {
      try {
        const parsed = JSON.parse(v);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        lastErr = e;
      }
    }
  }
  console.warn('⚠️ Could not parse model JSON. Raw preview:', raw.slice(0, 500));
  throw lastErr || new Error('No JSON array found in model response');
};

export { genAI, isGeminiConfigured, MODEL_CHAIN };
