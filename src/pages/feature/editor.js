import { getAllNotes, updateNotes } from "../../utils/storage.js";
import { currentUser } from "../../modules/auth/auth.js";

export default function Editor(container, id) {
  const all = getAllNotes();
  const note = all.find(n => n.id === id);
  const user = currentUser();

  if (!note) {
    container.innerHTML = `<section class="section"><h2>Editor</h2><p class="placeholder">Note not found.</p></section>`;
    return;
  }

  if (!user || note.userId !== user.id) {
    container.innerHTML = `<section class="section"><h2>Editor</h2><p class="placeholder">You don't have permission to edit this note.</p></section>`;
    return;
  }

  container.innerHTML = `
    <section class="section">
      <h2>Edit note</h2>
      <div class="card">
        <input id="edit-title" value="${escapeHtml(note.title||'')}" style="width:100%;padding:10px;border-radius:8px;margin-bottom:8px" />
        <input id="edit-subject" value="${escapeHtml(note.subject||'')}" style="width:50%;padding:8px;border-radius:8px;margin-bottom:8px" />
        <textarea id="edit-content" style="width:100%;height:220px;padding:10px;border-radius:8px">${escapeHtml(note.content||'')}</textarea>
        <div style="display:flex;gap:8px;margin-top:8px;align-items:center">
          <select id="edit-visibility">
            <option value="private">Private</option>
            <option value="public">Publish</option>
          </select>
          <button id="update-note" class="btn-primary">Update</button>
        </div>
      </div>
    </section>
  `;

  const vis = container.querySelector('#edit-visibility');
  vis.value = note.visibility || 'private';

  container.querySelector('#update-note').addEventListener('click', () => {
    const title = container.querySelector('#edit-title').value.trim();
    const subject = container.querySelector('#edit-subject').value.trim();
    const content = container.querySelector('#edit-content').value;
    const visibility = container.querySelector('#edit-visibility').value;
    const idx = all.findIndex(n => n.id === id);
    if (idx === -1) return;
    all[idx] = { ...all[idx], title, subject, content, visibility };
    updateNotes(all);
    location.hash = '/notes';
  });
}

function escapeHtml(str){
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}
