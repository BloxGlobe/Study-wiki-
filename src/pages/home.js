export default function Home(container) {
  container.innerHTML = `
    <div class="card">
      <h3>Dashboard</h3>
      <p>Your recent notes and projects will appear here.</p>
      <div style="margin-top:12px;display:flex;gap:12px;flex-wrap:wrap">
        <a class="btn-primary" href="#/notes">Open Notes</a>
        <a class="btn-secondary" href="#/library">View Library</a>
        <a class="btn-secondary" href="#/blocky">Ask Blocky (AI)</a>
      </div>
      <div style="margin-top:14px;color:var(--muted);font-size:13px">Recent activity will show here.</div>
    </div>
  `;
}
