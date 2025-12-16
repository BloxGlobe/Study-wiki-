// src/modules/aiAssistant.js
// Lightweight frontend wrapper that sends prompts to the server `/api/ai` proxy.
// The server should forward to OpenAI; this client keeps the key off the browser.

export async function generateText(prompt, opts = {}){
  const body = { prompt, options: opts };
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || 'AI request failed');
  }
  const data = await res.json();
  return data;
}

export default { generateText };
