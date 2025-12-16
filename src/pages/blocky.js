import { generateText } from "../modules/ai/index.js";

function ensureBlockyCSS(){
  const href = 'src/auth.css';
  if (!document.querySelector(`link[href="${href}"]`)){
    const l = document.createElement('link'); l.rel='stylesheet'; l.href=href; document.head.appendChild(l);
  }
}

export default function Blocky(container){
  ensureBlockyCSS();
  container.innerHTML = `
    <section class="section">
      <h2>Blocky — AI Assistant</h2>
      <div class="card">
        <label style="display:block;margin-bottom:6px">Format</label>
        <select id="blocky-format" style="width:220px;margin-bottom:10px">
          <option value="text">Text</option>
          <option value="number">Number</option>
          <option value="json">JSON</option>
          <option value="code">Code</option>
        </select>

        <textarea id="blocky-prompt" placeholder="Ask Blocky to generate text, summaries, numbers, or code..." style="width:100%;height:140px;padding:10px"></textarea>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button id="blocky-send" class="btn-primary">Ask Blocky</button>
          <button id="blocky-clear" class="btn-secondary">Clear</button>
        </div>
        <div id="blocky-response" style="margin-top:12px;white-space:pre-wrap"></div>
      </div>
    </section>
  `;

  const promptEl = container.querySelector('#blocky-prompt');
  const respEl = container.querySelector('#blocky-response');
  const formatEl = container.querySelector('#blocky-format');

  container.querySelector('#blocky-clear').addEventListener('click', ()=>{ promptEl.value = ''; respEl.textContent = ''; });
  container.querySelector('#blocky-send').addEventListener('click', async ()=>{
    const prompt = promptEl.value.trim();
    const fmt = formatEl.value;
    if (!prompt) return alert('Please enter a prompt');
    respEl.textContent = 'Thinking...';
    try{
      let finalPrompt = prompt;
      if (fmt === 'number') finalPrompt = `Respond with a single integer number (no extra text).\n\n${prompt}`;
      if (fmt === 'json') finalPrompt = `Respond with valid JSON only (no explanation).\n\n${prompt}`;
      if (fmt === 'code') finalPrompt = `Provide code only (no explanation). Use appropriate language if possible.\n\n${prompt}`;

      const data = await generateText(finalPrompt, { max_tokens: 400 });
      const out = (data && data.result) ? data.result : JSON.stringify(data);
      respEl.textContent = out;
    } catch(err){
      respEl.textContent = 'Error: ' + (err.message||String(err));
    }
  });
}
