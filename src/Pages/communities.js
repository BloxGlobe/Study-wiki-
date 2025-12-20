// src/Pages/communities.js
import { loadCSS } from "../utils/css/loadCSS.js";

export default function render(container) {
  // Load page-specific CSS safely
  loadCSS("src/utils/css/community.css", "community-css");

  container.innerHTML = `
    <div class="communities-layout">

      <!-- Sidebar -->
      <aside class="communities-sidebar">
        <h3 class="communities-title">My Communities</h3>

        <div id="joined-communities" class="community-list empty">
          <span>No communities joined</span>
        </div>

        <button id="open-search" class="btn primary full">
          + Find Communities
        </button>
      </aside>

      <!-- Main -->
      <section class="communities-main">

        <!-- Search Panel -->
        <div id="community-search" class="community-search hidden">
          <div class="search-header">
            <h3>Find Communities</h3>
            <button id="close-search" class="btn ghost">Close</button>
          </div>

          <div class="search-row">
            <input
              id="search-input"
              type="text"
              placeholder="Search communities..."
            />
            <button id="search-btn" class="btn primary">Search</button>
          </div>

          <div id="search-results" class="search-results"></div>
        </div>

        <!-- Community Wall -->
        <div id="community-wall" class="community-wall hidden">
          <div class="wall-header">
            <h2 id="community-name"></h2>
            <button id="leave-community" class="btn danger">Leave</button>
          </div>

          <div id="messages" class="messages"></div>

          <div class="message-input">
            <input id="message-input" placeholder="Type a message..." />
            <button id="send-message" class="btn primary">Send</button>
          </div>
        </div>

        <!-- Empty State -->
        <div id="community-empty" class="community-empty">
          Select or find a community to get started
        </div>

      </section>
    </div>
  `;

  // ---------- UI LOGIC ----------
  const searchPanel = container.querySelector("#community-search");
  const wall = container.querySelector("#community-wall");
  const empty = container.querySelector("#community-empty");

  const openSearch = container.querySelector("#open-search");
  const closeSearch = container.querySelector("#close-search");

  openSearch.onclick = () => {
    searchPanel.classList.remove("hidden");
    wall.classList.add("hidden");
    empty.classList.add("hidden");
  };

  closeSearch.onclick = () => {
    searchPanel.classList.add("hidden");
    empty.classList.remove("hidden");
  };
}
