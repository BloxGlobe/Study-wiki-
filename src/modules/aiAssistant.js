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
  // normalize Responses API shape to something useful for the UI
  // Responses API may include `output` or `choices` depending on response
  if (data && data.output && Array.isArray(data.output)){
    return { result: data.output.map(o=>o.content).join('\n'), raw: data };
  }
  // try older choice formats
  if (data && data.choices && data.choices.length){
    return { result: data.choices.map(c => c.text || (c.message && c.message.content) || '').join('\n'), raw: data };
  }
  return { result: JSON.stringify(data), raw: data };
}

export default { generateText };
