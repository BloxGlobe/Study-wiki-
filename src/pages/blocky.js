import { generateText } from "../modules/aiAssistant.js";

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
        <textarea id="blocky-prompt" placeholder="Ask Blocky to generate text, summaries, or ideas..." style="width:100%;height:160px;padding:10px"></textarea>
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
  container.querySelector('#blocky-clear').addEventListener('click', ()=>{ promptEl.value = ''; respEl.textContent = ''; });
  container.querySelector('#blocky-send').addEventListener('click', async ()=>{
    const prompt = promptEl.value.trim();
    if (!prompt) return alert('Please enter a prompt');
    respEl.textContent = 'Thinking...';
    try{
      const data = await generateText(prompt, { max_tokens: 400 });
      // support either choices/text or message format
      let out = '';
      if (data.choices && data.choices.length){
        out = data.choices.map(c => c.text || (c.message && c.message.content) || '').join('\n');
      } else if (data.result) out = data.result;
      respEl.textContent = out || JSON.stringify(data);
    } catch(err){
      respEl.textContent = 'Error: ' + (err.message||String(err));
    }
  });
}
