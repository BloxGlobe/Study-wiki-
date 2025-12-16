import { getAllNotes, saveNote, updateNotes, getUsers, updateUsers } from "../../utils/storage.js";
import { sanitizeText, containsBadWords } from "../../utils/filter.js";
import { setCurrentUser } from "../../modules/session.js";
import { showModal } from "../../components/Modal.js";
import { currentUser } from "../../modules/auth.js";

function renderNoteCard(note) {
	const div = document.createElement('div');
	div.className = 'card';
	div.style.padding = '12px';
	div.innerHTML = `
		<h3>${note.title || 'Untitled'}</h3>
		<p style="color:var(--muted);font-size:13px;margin:6px 0">${note.subject || 'General'}</p>
		<p style="opacity:.9">${(note.content||'').slice(0,200)}${(note.content||'').length>200?'…':''}</p>
		<div style="margin-top:8px;display:flex;gap:8px">
			<button class="btn-secondary" data-action="edit" data-id="${note.id}">Edit</button>
			<button class="btn-secondary" data-action="toggle" data-id="${note.id}">${note.visibility==='public'?'Make private':'Publish'}</button>
		</div>
	`;
	return div;
}

export default function Notes(container) {
	container.innerHTML = `
		<section class="section">
			<h2>Notes</h2>
			<div class="card" id="new-note-card" style="margin-bottom:14px">
						<input id="note-title" placeholder="Title" style="width:100%;padding:10px;border-radius:8px;margin-bottom:8px" />
						<input id="note-subject" placeholder="Subject" style="width:50%;padding:8px;border-radius:8px;margin-bottom:8px" />
						<textarea id="note-content" placeholder="Write your note here..." style="width:100%;height:120px;padding:10px;border-radius:8px"></textarea>
						<div style="display:flex;gap:8px;margin-top:8px;align-items:center">
							<select id="note-visibility">
								<option value="private">Private</option>
								<option value="public">Publish</option>
							</select>
							<button id="save-note" class="btn-primary">Save</button>
							<button id="publish-note" class="btn-secondary">Publish Note</button>
						</div>
			</div>

				<section style="margin-top:18px">
				  <h3>My notes</h3>
				  <div id="notes-list"></div>
				</section>
		</section>
	`;

	const user = currentUser();
	if (!user) {
		const noteRoot = container.querySelector('#notes-list');
		noteRoot.innerHTML = '<p class="placeholder">Sign in to create and view your notes. Use the Account page to sign up.</p>';
		return;
	}

	function loadNotes() {
		const all = getAllNotes() || [];
		// show notes for current user plus public ones
		const mine = all.filter(n => n.userId === user.id || n.visibility === 'public');
		const list = container.querySelector('#notes-list');
		list.innerHTML = '';
		// Build categorized view: Published / Private / Others
		const myOnly = mine.filter(n => n.userId === user.id);
		const published = myOnly.filter(n => n.visibility === 'public');
		const priv = myOnly.filter(n => n.visibility === 'private');
		const others = mine.filter(n => n.userId !== user.id && n.visibility === 'public');

		function renderSection(title, arr){
			const sec = document.createElement('div');
			const h = document.createElement('h4'); h.textContent = title; sec.appendChild(h);
			if (arr.length === 0){
				const p = document.createElement('div'); p.className='placeholder'; p.textContent = '—'; sec.appendChild(p);
				return sec;
			}
			const grid = document.createElement('div');
			grid.style.display = 'grid';
			grid.style.gridTemplateColumns = 'repeat(auto-fill,minmax(260px,1fr))';
			grid.style.gap = '12px';
			arr.forEach(n => grid.appendChild(renderNoteCard(n)));
			sec.appendChild(grid);
			return sec;
		}

		list.appendChild(renderSection('Published', published));
		list.appendChild(renderSection('Private', priv));
		list.appendChild(renderSection('Community (public)', others));
	}

	loadNotes();

	container.querySelector('#save-note').addEventListener('click', () => {
		const title = container.querySelector('#note-title').value.trim();
		const subject = container.querySelector('#note-subject').value.trim();
		const content = container.querySelector('#note-content').value;
		const visibility = container.querySelector('#note-visibility').value;
		const note = { id: Date.now().toString(), title, subject, content: (visibility==='public'? sanitizeText(content):content), visibility, userId: user.id };
		saveNote(note);
		// auto-ban if content contains bad words (even in private)
		if (containsBadWords(title) || containsBadWords(subject) || containsBadWords(content)) {
			const users = getUsers();
			const idx = users.findIndex(u => u.id === user.id);
							if (idx !== -1) {
								users[idx].banned = true;
								users[idx].banUntil = Date.now() + (24*60*60*1000);
								users[idx].banReason = 'Automated moderation: offensive content in note';
								updateUsers(users);
								// clear session
								setCurrentUser(null);
								try {
									const until = new Date(users[idx].banUntil).toString();
									const mins = Math.ceil((users[idx].banUntil - Date.now())/60000);
									showModal(`<div style="max-width:560px"><h3>Account suspended</h3><p>Your account was suspended due to policy violations in a note.</p><p><strong>Reason:</strong> ${users[idx].banReason}</p><p><strong>Suspended until:</strong> ${until}</p><p style="color:var(--muted)">Estimated time remaining: ${mins} minute(s)</p><div style="margin-top:12px;display:flex;gap:8px"><button id="ban-view2" class="btn-secondary">View details</button><button id="ban-ok2" class="btn-primary">OK</button></div></div>`);
									document.querySelector('#ban-ok2')?.addEventListener('click', () => { const m = document.querySelector('.app-modal'); if (m) m.dispatchEvent(new Event('click')); });
									document.querySelector('#ban-view2')?.addEventListener('click', ()=>{ const m = document.querySelector('.app-modal'); if (m) m.dispatchEvent(new Event('click')); location.hash = '/banned'; });
								} catch(e){}
			}
		}
		container.querySelector('#note-title').value = '';
		container.querySelector('#note-subject').value = '';
		container.querySelector('#note-content').value = '';
		loadNotes();
	});

	// Publish single note from composer
	container.querySelector('#publish-note').addEventListener('click', async () => {
		const title = container.querySelector('#note-title').value.trim();
		const subject = container.querySelector('#note-subject').value.trim();
		const content = container.querySelector('#note-content').value;
		if (!title && !content) return alert('Enter a title or content first');
		const note = { id: Date.now().toString(), title, subject, content: sanitizeText(content), visibility: 'public', userId: user.id };
		saveNote(note);
		container.querySelector('#note-title').value = '';
		container.querySelector('#note-subject').value = '';
		container.querySelector('#note-content').value = '';
		loadNotes();
		location.hash = '/library';
	});

	container.addEventListener('click', (e) => {
		const btn = e.target.closest('button[data-action]');
		if (!btn) return;
		const id = btn.dataset.id;
		const action = btn.dataset.action;
		const all = getAllNotes();
		const idx = all.findIndex(x => x.id === id);
		if (idx === -1) return;
		if (action === 'edit') {
			// inline edit modal
			const note = all[idx];
			const editor = document.createElement('div');
			editor.innerHTML = `
				<h3>Edit note</h3>
				<div style="margin:8px 0"><input id="edit-title" value="${(note.title||'').replace(/"/g,'&quot;')}" style="width:100%;padding:8px;border-radius:8px" /></div>
				<div style="margin:8px 0"><input id="edit-subject" value="${(note.subject||'').replace(/"/g,'&quot;')}" style="width:100%;padding:8px;border-radius:8px" /></div>
				<div style="margin:8px 0"><textarea id="edit-content" style="width:100%;height:160px;padding:8px;border-radius:8px">${(note.content||'')}</textarea></div>
				<div style="display:flex;gap:8px;margin-top:8px"><button id="edit-save" class="btn-primary">Save</button><button id="edit-cancel" class="btn-secondary">Cancel</button></div>
			`;
			showModal(editor);
			document.getElementById('edit-cancel').addEventListener('click', ()=>{ const m = document.querySelector('.app-modal'); if (m) m.dispatchEvent(new Event('click')); });
			document.getElementById('edit-save').addEventListener('click', ()=>{
				all[idx].title = document.getElementById('edit-title').value.trim();
				all[idx].subject = document.getElementById('edit-subject').value.trim();
				all[idx].content = all[idx].visibility==='public' ? sanitizeText(document.getElementById('edit-content').value) : document.getElementById('edit-content').value;
				updateNotes(all);
				const m = document.querySelector('.app-modal'); if (m) m.dispatchEvent(new Event('click'));
				loadNotes();
			});
		} else if (action === 'toggle') {
			all[idx].visibility = all[idx].visibility === 'public' ? 'private' : 'public';
			// sanitize if making public
			if (all[idx].visibility === 'public') all[idx].content = sanitizeText(all[idx].content);
			updateNotes(all);
			loadNotes();
		}
	});
}
