import { getAllNotes } from "../utils/storage.js";
import { sanitizeText } from "../components/filters/filter.js";

export default function Home(container) {
  const notes = getAllNotes();

  // Optional: show up to 3 recent notes
  const recentNotes = notes
    .sort((a, b) => (b.createdAt || b.id) - (a.createdAt || a.id))
    .slice(0, 3);

  container.innerHTML = `
    <section class="section dashboard">
      <div class="card">
        <h2>Welcome to StudyWiki Dashboard</h2>
        <p style="margin-top:4px;color:var(--muted);">
          Here you can quickly access your notes, view the public library, and interact with Blocky, your AI assistant.
        </p>

        <div style="margin-top:16px; display:flex; gap:12px; flex-wrap:wrap;">
          <a class="btn-primary" href="#/notes">Open Notes</a>
          <a class="btn-secondary" href="#/library">View Library</a>
          <a class="btn-secondary" href="#/blocky">Ask Blocky (AI)</a>
        </div>

        <div style="margin-top:24px;">
          <h3>Recent Notes</h3>
          <div id="recent-notes" style="margin-top:8px;">
            ${recentNotes.length > 0 ? recentNotes.map(n => `
              <div class="recent-note card" style="padding:8px; margin-bottom:6px;">
                <strong>${sanitizeText(n.title || 'Untitled')}</strong>
                <p style="margin:2px 0; font-size:13px; color:var(--muted);">
                  ${sanitizeText((n.content||'').slice(0,80))}${(n.content||'').length>80?"…":""}
                </p>
              </div>
            `).join('') : `<p style="color:var(--muted); font-size:14px;">No recent notes available.</p>`}
          </div>
        </div>

        <div style="margin-top:20px; color:var(--muted); font-size:13px;">
          You can manage your profile, update settings, and monitor your activity from the dashboard.
        </div>
      </div>
    </section>
  `;
}
