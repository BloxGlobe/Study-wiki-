import { getAllNotes, saveNote, updateNotes, getUsers, updateUsers } from "../../utils/storage.js";
import { sanitizeText, containsBadWords } from "../../utils/filter.js";
import { setCurrentUser } from "../../modules/session.js";
import { sanitizeText } from "../../utils/filter.js";
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
				</div>
			</div>

			<div id="notes-list"></div>
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
		if (mine.length === 0) {
			list.innerHTML = '<p class="placeholder">No notes yet.</p>';
			return;
		}
		const grid = document.createElement('div');
		grid.style.display = 'grid';
		grid.style.gridTemplateColumns = 'repeat(auto-fill,minmax(260px,1fr))';
		grid.style.gap = '12px';
		mine.forEach(n => grid.appendChild(renderNoteCard(n)));
		list.appendChild(grid);
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
					showModal(`<div style="max-width:560px"><h3>Account banned</h3><p>Your account was banned due to policy violations in a note.</p><p><strong>Banned until:</strong> ${new Date(users[idx].banUntil).toString()}</p><div style="margin-top:12px"><button id="ban-ok2" class="btn-primary">OK</button></div></div>`);
					document.querySelector('#ban-ok2')?.addEventListener('click', () => { const m = document.querySelector('.app-modal'); if (m) m.dispatchEvent(new Event('click')); });
				} catch(e){}
			}
		}
		container.querySelector('#note-title').value = '';
		container.querySelector('#note-subject').value = '';
		container.querySelector('#note-content').value = '';
		loadNotes();
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
			location.hash = `/editor/${id}`;
		} else if (action === 'toggle') {
			all[idx].visibility = all[idx].visibility === 'public' ? 'private' : 'public';
			// sanitize if making public
			if (all[idx].visibility === 'public') all[idx].content = sanitizeText(all[idx].content);
			updateNotes(all);
			loadNotes();
		}
	});
}
