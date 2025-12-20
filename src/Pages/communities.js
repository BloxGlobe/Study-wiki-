// src/Pages/communities.js
export default function render(container) { }
  container.innerHTML = `
    <div class="communities-container" style="display: flex; gap: 1rem; height: 100vh;">
      <!-- Sidebar -->
      <div class="communities-sidebar" style="width: 250px; background: #f5f5f5; padding: 1rem; border-radius: 8px; overflow-y: auto; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h3 style="margin-top: 0; font-size: 1.485rem;">My Communities</h3>
        <div id="joined-communities" style="display: flex; flex-direction: column; gap: 0.5rem;">
          <!-- Joined communities will be listed here -->
        </div>
        <hr style="margin: 1rem 0;">
        <button id="show-search-btn" style="width: 100%; padding: 0.5rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.99rem;">+ Find Communities</button>
      </div>

      <!-- Main Content -->
      <div class="communities-main" style="flex: 1; display: flex; flex-direction: column;">
        <!-- Search Section -->
        <div id="search-section" style="display: none; padding: 1rem; background: white; border-radius: 8px; margin-bottom: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3 style="margin-top: 0; font-size: 1.485rem;">Search Communities</h3>
          <div style="display: flex; gap: 0.5rem;">
            <input type="text" id="search-input" placeholder="Search for a community..." style="flex: 1; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; font-size: 0.99rem;">
            <button id="search-btn" style="padding: 0.5rem 1rem; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.99rem;">Search</button>
            <button id="close-search-btn" style="padding: 0.5rem 1rem; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.99rem;">Close</button>
          </div>
          <div id="search-results" style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem;">
            <!-- Search results will appear here -->
          </div>
        </div>

        <!-- Group Wall Section -->
        <div id="group-wall-section" style="display: none; flex: 1; background: white; border-radius: 8px; padding: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); display: flex; flex-direction: column;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h2 id="current-community-name" style="margin: 0; font-size: 1.98rem;"></h2>
            <button id="leave-community-btn" style="padding: 0.5rem 1rem; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.99rem;">Leave Community</button>
          </div>

          <!-- Messages Display -->
          <div id="messages-container" style="flex: 1; overflow-y: auto; margin-bottom: 1rem; padding: 1rem; background: #f9f9f9; border-radius: 4px; border: 1px solid #eee;">
            <!-- Messages will be displayed here -->
          </div>

          <!-- Message Input -->
          <div style="display: flex; gap: 0.5rem;">
            <input type="text" id="message-input" placeholder="Type a message..." style="flex: 1; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; font-size: 0.99rem;">
            <button id="send-message-btn" style="padding: 0.5rem 1rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.99rem;">Send</button>
          </div>
        </div>

        <!-- No Community Selected -->
        <div id="no-community-section"