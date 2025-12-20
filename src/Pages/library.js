// src/Pages/library.js

import { getAllNotes, getUsers, getCommunities } from "../Utils/storage.js";

export default function render(container) {
  // Hides global search only on Library
  const globalSearch = document.querySelector(".search");
  if (globalSearch) globalSearch.style.display = "none";

  container.innerHTML = `
    <div class="card">

      <h2 style="font-size:1.6rem; margin-bottom:0.5rem;">Library</h2>

      <!-- Search -->
      <div style="position:relative; margin-bottom:1rem;">
        <div style="display:flex; gap:0.5rem;">
          <input
            id="library-search-input"
            placeholder="Search..."
            style="
              flex:1;
              padding:0.6rem 0.7rem;
              border-radius:10px;
              border:1px solid rgba(255,255,255,0.08);
              background:rgba(255,255,255,0.04);
              color:#fff;
              font-size:0.9rem;
              outline:none;
            "
          />
          <button
            id="library-filter-btn"
            style="
              padding:0.6rem 0.8rem;
              border-radius:10px;
              border:1px solid rgba(255,255,255,0.08);
              background:rgba(255,255,255,0.04);
              color:#fff;
              cursor:pointer;
              font-size:0.85rem;
            "
          >
            Notes ▾
          </button>
        </div>

        <div
          id="library-filter-dropdown"
          style="
            display:none;
            position:absolute;
            top:110%;
            right:0;
            width:180px;
            background:#0b0d0f;
            border:1px solid rgba(255,255,255,0.08);
            border-radius:10px;
            padding:0.35rem;
            z-index:20;
          "
        >
          <div class="filter-item" data-type="notes">Notes</div>
          <div class="filter-item" data-type="users">Users</div>
          <div class="filter-item" data-type="communities">Communities</div>
        </div>
      </div>

      <div
        id="library-results"
        style="display:flex; flex-direction:column; gap:0.6rem;"
      >
        <div class="placeholder">Start typing to search</div>
      </div>

    </div>
  `;

  const input = container.querySelector("#library-search-input");
  const btn = container.querySelector("#library-filter-btn");
  const dropdown = container.querySelector("#library-filter-dropdown");
  const results = container.querySelector("#library-results");

  let filter = "notes";

  // Dropdown toggle
  btn.onclick = () => {
    dropdown.style.display =
      dropdown.style.display === "block" ? "none" : "block";
  };

  // Filter select
  dropdown.querySelectorAll(".filter-item").forEach(item => {
    item.style.padding = "0.45rem 0.6rem";
    item.style.cursor = "pointer";
    item.style.borderRadius = "8px";

    item.onmouseenter = () => {
      item.style.background = "rgba(255,255,255,0.06)";
    };
    item.onmouseleave = () => {
      item.style.background = "transparent";
    };

    item.onclick = () => {
      filter = item.dataset.type;
      btn.textContent = `${filter[0].toUpperCase()}${filter.slice(1)} ▾`;
      dropdown.style.display = "none";
      runSearch(input.value);
    };
  });

  input.oninput = () => runSearch(input.value);

  function runSearch(query) {
    results.innerHTML = "";

    if (!query.trim()) {
      results.innerHTML = `<div class="placeholder">Start typing to search</div>`;
      return;
    }

    let data = [];

    try {
      if (filter === "notes") data = getAllNotes?.() || [];
      if (filter === "users") data = getUsers?.() || [];
      if (filter === "communities") data = getCommunities?.() || [];
    } catch {
      data = [];
    }

    const q = query.toLowerCase();
    const matches = data.filter(item =>
      JSON.stringify(item).toLowerCase().includes(q)
    );

    if (!matches.length) {
      results.innerHTML = `<div class="placeholder">No results found</div>`;
      return;
    }

    matches.forEach(item => {
      results.innerHTML += `
        <div class="card" style="padding:0.75rem;">
          <strong>${item.title || item.username || item.name || "Untitled"}</strong>
          <div style="font-size:0.8rem; opacity:0.7;">
            ${filter.slice(0, -1)}
          </div>
        </div>
      `;
    });
  }
}
