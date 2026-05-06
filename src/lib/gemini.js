import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  FOOD_ANALYSIS_PROMPT,
  MEAL_TEXT_PROMPT,
  NUTRITIONIST_SYSTEM_PROMPT,
  RECOMMENDATIONS_PROMPT,
  INSIGHT_PROMPT,
} from './prompts';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export function getModel(modelName = 'gemini-2.5-flash') {
  return genAI.getGenerativeModel({ model: modelName });
}

async function withRetry(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try { return await fn(); }
    catch (e) {
      if (i === retries - 1) throw e;
      if (e.message?.includes('503') || e.message?.includes('overloaded')) {
        await new Promise(r => setTimeout(r, 1000 * (i + 1)));
      } else throw e;
    }
  }
}

function extractJSON(text) {
  const codeBlock = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlock) return codeBlock[1].trim();
  const raw = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (raw) return raw[1].trim();
  return text.trim();
}

export async function analyzeFoodImage(imageBase64, mimeType = 'image/jpeg') {
  return withRetry(async () => {
    const model = getModel();
    const result = await model.generateContent([
      { inlineData: { data: imageBase64, mimeType } },
      { text: FOOD_ANALYSIS_PROMPT },
    ]);
    return JSON.parse(extractJSON(result.response.text()));
  });
}

export async function analyzeMealText(description, userContext = {}) {
  return withRetry(async () => {
    const model = getModel();
    const prompt = MEAL_TEXT_PROMPT
      .replace('{{DESCRIPTION}}', description)
      .replace('{{USER_CONTEXT}}', JSON.stringify(userContext));
    const result = await model.generateContent(prompt);
    return JSON.parse(extractJSON(result.response.text()));
  });
}

export async function chatWithNutritionist(messages, userContext = {}) {
  return withRetry(async () => {
    const model = getModel();
    const systemPrompt = NUTRITIONIST_SYSTEM_PROMPT
      .replace('{{USER_CONTEXT}}', JSON.stringify(userContext, null, 2));
    const history = messages.slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
    const chat = model.startChat({ history, systemInstruction: systemPrompt });
    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    return result.response.text();
  });
}

export async function getRecommendations(userContext = {}) {
  return withRetry(async () => {
    const model = getModel();
    const prompt = RECOMMENDATIONS_PROMPT
      .replace('{{USER_CONTEXT}}', JSON.stringify(userContext, null, 2));
    const result = await model.generateContent(prompt);
    return JSON.parse(extractJSON(result.response.text()));
  });
}

export async function getDailyInsight(userContext = {}) {
  return withRetry(async () => {
    const model = getModel();
    const prompt = INSIGHT_PROMPT
      .replace('{{USER_CONTEXT}}', JSON.stringify(userContext, null, 2));
    const result = await model.generateContent(prompt);
    return result.response.text();
  });
}
