// src/modules/ai/index.js
// Frontend AI wrapper located in `src/modules/ai` for future expansion.
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
  if (data && data.output && Array.isArray(data.output)){
    return { result: data.output.map(o=>o.content).join('\n'), raw: data };
  }
  if (data && data.choices && data.choices.length){
    return { result: data.choices.map(c => c.text || (c.message && c.message.content) || '').join('\n'), raw: data };
  }
  return { result: JSON.stringify(data), raw: data };
}

export default { generateText };
