import { getAllNotes, updateNotes } from "../../utils/storage.js";
import { getUsers, updateUsers } from "../../utils/storage.js";
import { sanitizeText } from "../../utils/filter.js";

export default function Moderator(container) {
  ensureModeratorCSS();
  container.innerHTML = `
    <section class="section">
      <h2>Moderator</h2>
      <div class="card">
        <div style="display:flex;gap:12px;flex-wrap:wrap">
          <button id="refresh" class="btn-secondary">Refresh</button>
        </div>
        <div id="moderator-root" style="margin-top:12px"></div>
      </div>
    </section>
  `;

  container.querySelector('#refresh').addEventListener('click', render);
  render();

  function render(){
    const root = container.querySelector('#moderator-root');
    root.innerHTML = '';
    const notes = getAllNotes();
    const users = getUsers();

    const ulist = document.createElement('div');
    ulist.innerHTML = '<h3>Users</h3>';
    users.forEach(u => {
      const el = document.createElement('div');
      el.className = 'mod-row';
      el.innerHTML = `<strong>${u.name||'(no name)'}</strong> <span>${u.email}</span> <button data-action="ban-user" data-email="${u.email}" class="btn-secondary">Delete</button>`;
      ulist.appendChild(el);
    });

    const nlist = document.createElement('div');
    nlist.innerHTML = '<h3 style="margin-top:12px">Notes</h3>';
    notes.forEach(n => {
      const el = document.createElement('div');
      el.className = 'mod-row';
      el.innerHTML = `<strong>${n.title||'Untitled'}</strong> <span>by ${n.userId}</span> <button data-action="remove-note" data-id="${n.id}" class="btn-secondary">Remove</button> <button data-action="sanitize-note" data-id="${n.id}" class="btn-secondary">Sanitize</button>`;
      nlist.appendChild(el);
    });

    root.appendChild(ulist);
    root.appendChild(nlist);
  }

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    if (action === 'ban-user') {
      const email = btn.dataset.email;
      const users = getUsers().filter(u => u.email !== email);
      updateUsers(users);
      render();
    } else if (action === 'remove-note') {
      const id = btn.dataset.id;
      const notes = getAllNotes().filter(n => n.id !== id);
      updateNotes(notes);
      render();
    } else if (action === 'sanitize-note') {
      const id = btn.dataset.id;
      const notes = getAllNotes();
      const idx = notes.findIndex(n => n.id === id);
      if (idx !== -1) {
        notes[idx].content = sanitizeText(notes[idx].content);
        updateNotes(notes);
      }
      render();
    }
  });
}

function ensureModeratorCSS(){
  const href = 'src/moderator.css';
  if (!document.querySelector(`link[href="${href}"]`)){
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = href;
    document.head.appendChild(l);
  }
}
