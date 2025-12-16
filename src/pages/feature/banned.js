import { getUsers } from "../../utils/storage.js";

function ensureBannedCSS(){
  const href = 'src/banned.css';
  if (!document.querySelector(`link[href="${href}"]`)){
    const l = document.createElement('link'); l.rel='stylesheet'; l.href=href; document.head.appendChild(l);
  }
}

export default function Banned(container){
  ensureBannedCSS();
  container.innerHTML = `
    <section class="section">
      <h2>Account banned</h2>
      <div class="card banned-card">
        <h3>Account restricted</h3>
        <div class="banned-reason" id="banned-reason">Your account has been restricted due to policy violations.</div>
        <div class="banned-meta" id="banned-meta"></div>
        <div class="banned-actions"><button id="banned-back" class="btn-secondary">Back to Home</button></div>
      </div>
    </section>
  `;

  container.querySelector('#banned-back').addEventListener('click', ()=> location.hash = '/home');

  // If logged-in user is banned, show their ban details
  try{
    const users = getUsers();
    const cur = JSON.parse(localStorage.getItem('studywiki:session')||'null');
    if (cur){
      const u = users.find(x=>x.id===cur.id || x.email===cur.email);
      if (u && u.banned){
        const reasonEl = container.querySelector('#banned-reason');
        const metaEl = container.querySelector('#banned-meta');
        reasonEl.textContent = u.banReason || reasonEl.textContent;
        metaEl.textContent = u.banUntil ? `Banned until: ${new Date(Number(u.banUntil)).toString()}` : 'Ban duration: indefinite';
      }
    }
  } catch(e){}
}
