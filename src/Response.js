const MODELS = [
  'openai/gpt-oss-20b',
  'openai/gpt-oss-120b',
  'qwen/qwen3.6-27b',
];

const SYSTEM_PROMPT =
  'You are a helpful AI assistant. Keep responses concise, friendly, and engaging.';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function callGroq(model, userPrompt, API_KEY) {
  const body = {
    model,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    // reasoning models spend tokens thinking, so 150 would leave an empty reply
    max_tokens: 1024,
    temperature: 0.7,
  };
  if (model.startsWith('openai/gpt-oss')) body.reasoning_effort = 'low';

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const err = new Error(
      `Groq API error: ${errorData.error?.message || response.statusText}`
    );
    err.status = response.status;
    throw err;
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error('Model returned an empty reply');
  return text;
}

export async function getBotReply(userPrompt) {
  const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
  if (!API_KEY) throw new Error('Groq API key not found');

  let lastError;
  for (const model of MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        return await callGroq(model, userPrompt, API_KEY);
      } catch (error) {
        lastError = error;
        console.error(`Groq ${model} attempt ${attempt + 1} failed:`, error.message);
        if (error.status === 401) throw error; // bad key, no point retrying
        if (![429, 500, 503].includes(error.status)) break; // try next model
        await sleep(1500);
      }
    }
  }
  throw lastError;
}

// Kept so App.jsx doesn't change. Fake canned replies removed: they hid real
// errors, so App.jsx's error messages never showed.
export async function getBotReplyWithFallback(userPrompt) {
  return getBotReply(userPrompt);
}
