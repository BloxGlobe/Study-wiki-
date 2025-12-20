// src/Pages/feature/updatelog.js
import { loadCSS } from "../../utils/css/loadCSS.js";

export function showUpdateLog() {
  const version = document.body.dataset.version;
  const seenKey = `update_seen_${version}`;

  if (localStorage.getItem(seenKey)) return;

  loadCSS("src/utils/css/update.css", "update-css");

  const root = document.getElementById("update-log-root");
  if (!root) return;

  root.innerHTML = `
    <div class="update-overlay">
      <div class="update-modal">
        <h2>What’s New in v${version}</h2>

        <ul class="update-list">
          <li>✨ New Communities system</li>
          <li>🧭 Sidebar & navigation redesign</li>
          <li>🔒 Improved account security</li>
          <li>⚡ Performance & UI optimizations</li>
        </ul>

        <button id="close-update" class="btn primary">
          Got it
        </button>
      </div>
    </div>
  `;

  document.getElementById("close-update").onclick = () => {
    localStorage.setItem(seenKey, "true");
    root.innerHTML = "";
  };
}
