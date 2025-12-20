// src/Pages/communities.js

export default function render(container) {
  container.innerHTML = `
    <div class="communities-container" style="display:flex; gap:1rem; height:100%;">

      <!-- Sidebar -->
      <div class="communities-sidebar" style="width:250px; background:#f5f5f5; padding:1rem; border-radius:8px; overflow-y:auto; box-shadow:0 2px 4px rgba(0,0,0,0.1);">
        <h3 style="margin-top:0; font-size:1.485rem;">My Communities</h3>

        <div id="joined-communities" style="display:flex; flex-direction:column; gap:0.5rem;">
          <div style="font-size:0.9rem; color:#666;">No communities joined</div>
        </div>

        <hr style="margin:1rem 0;">

        <button id="show-search-btn"
          style="width:100%; padding:0.5rem; background:#007bff; color:#fff; border:none; border-radius:4px; cursor:pointer;">
          + Find Communities
        </button>
      </div>

      <!-- Main -->
      <div class="communities-main" style="flex:1; display:flex; flex-direction:column;">

        <!-- Search -->
        <div id="search-section"
          style="display:none; padding:1rem; background:#fff; border-radius:8px; margin-bottom:1rem; box-shadow:0 2px 4px rgba(0,0,0,0.1);">
          <h3 style="margin-top:0;">Search Communities</h3>

          <div style="display:flex; gap:0.5rem;">
            <input id="search-input" placeholder="Search for a community..."
              style="flex:1; padding:0.5rem; border:1px solid #ddd; border-radius:4px;">
            <button id="search-btn"
              style="background:#28a745; color:#fff; border:none; border-radius:4px; padding:0.5rem 1rem;">
              Search
            </button>
            <button id="close-search-btn"
              style="background:#6c757d; color:#fff; border:none; border-radius:4px; padding:0.5rem 1rem;">
              Close
            </button>
          </div>

          <div id="search-results" style="margin-top:1rem; display:flex; flex-direction:column; gap:0.5rem;"></div>
        </div>

        <!-- Group Wall -->
        <div id="group-wall-section"
          style="display:none; flex:1; background:#fff; border-radius:8px; padding:1rem; box-shadow:0 2px 4px rgba(0,0,0,0.1); flex-direction:column;">
          
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <h2 id="current-community-name" style="margin:0;"></h2>
            <button id="leave-community-btn"
              style="background:#dc3545; color:#fff; border:none; border-radius:4px; padding:0.5rem 1rem;">
              Leave
            </button>
          </div>

          <div id="messages-container"
            style="flex:1; overflow-y:auto; margin-bottom:1rem; padding:1rem; background:#f9f9f9; border-radius:4px; border:1px solid #eee;">
          </div>

          <div style="display:flex; gap:0.5rem;">
            <input id="message-input" placeholder="Type a message..."
              style="flex:1; padding:0.5rem; border:1px solid #ddd; border-radius:4px;">
            <button id="send-message-btn"
              style="background:#007bff; color:#fff; border:none; border-radius:4px; padding:0.5rem 1rem;">
              Send
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div id="no-community-section"
          style="flex:1; display:flex; align-items:center; justify-content:center; color:#666; font-size:1rem;">
          Select or find a community to get started
        </div>

      </div>
    </div>
  `;

  // ---------- BASIC UI LOGIC ----------
  const searchSection = container.querySelector("#search-section");
  const showSearchBtn = container.querySelector("#show-search-btn");
  const closeSearchBtn = container.querySelector("#close-search-btn");

  showSearchBtn.onclick = () => {
    searchSection.style.display = "block";
  };

  closeSearchBtn.onclick = () => {
    searchSection.style.display = "none";
  };
}
