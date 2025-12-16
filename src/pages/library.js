// src/pages/library.js
import { getAllNotes } from "../utils/storage.js";

export default function renderLibrary(container) {
  container.innerHTML = "";

  const notes = getAllNotes().filter(n => n.visibility === "public");

  // Top section with title + search + sort
  const topSection = document.createElement("section");
  topSection.className = "section";

  const title = document.createElement("h2");
  title.textContent = "Public Library";
  title.style.marginBottom = "12px";

  topSection.appendChild(title);

  // Search input
  const searchInput = document.createElement("input");
  searchInput.type = "search";
  searchInput.placeholder = "Search notes...";
  searchInput.style.width = "100%";
  searchInput.style.padding = "10px 14px";
  searchInput.style.borderRadius = "10px";
  searchInput.style.border = "1px solid rgba(255,255,255,0.05)";
  searchInput.style.background = "rgba(255,255,255,0.04)";
  searchInput.style.color = "#fff";
  searchInput.style.marginBottom = "16px";
  searchInput.addEventListener("input", () => {
    renderGrid(searchInput.value);
  });

  topSection.appendChild(searchInput);

  // Sort select
  const sortSelect = document.createElement("select");
  sortSelect.style.marginBottom = "16px";
  sortSelect.style.padding = "8px 12px";
  sortSelect.style.borderRadius = "10px";
  sortSelect.style.border = "1px solid rgba(255,255,255,0.05)";
  sortSelect.style.background = "rgba(255,255,255,0.04)";
  sortSelect.style.color = "#fff";

  ["Newest", "Oldest", "A → Z", "Z → A"].forEach(opt => {
    const option = document.createElement("option");
    option.value = opt.toLowerCase().replace(/\s/g, "-");
    option.textContent = opt;
    sortSelect.appendChild(option);
  });

  sortSelect.addEventListener("change", () => {
    renderGrid(searchInput.value);
  });

  topSection.appendChild(sortSelect);

  container.appendChild(topSection);

  // Section for note cards
  const gridSection = document.createElement("section");
  gridSection.className = "section";
  container.appendChild(gridSection);

  function renderGrid(searchTerm = "") {
    gridSection.innerHTML = "";

    let filteredNotes = notes.filter(note =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (note.subject && note.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort notes
    switch (sortSelect.value) {
      case "oldest":
        filteredNotes = filteredNotes.sort((a,b)=>a.createdAt-b.createdAt);
        break;
      case "a-→-z":
        filteredNotes = filteredNotes.sort((a,b)=>a.title.localeCompare(b.title));
        break;
      case "z-→-a":
        filteredNotes = filteredNotes.sort((a,b)=>b.title.localeCompare(a.title));
        break;
      default: // newest
        filteredNotes = filteredNotes.sort((a,b)=>b.createdAt-a.createdAt);
    }

    if (filteredNotes.length === 0) {
      const empty = document.createElement("div");
      empty.className = "placeholder";
      empty.textContent = "No public notes found.";
      gridSection.appendChild(empty);
      return;
    }

    const grid = document.createElement("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(auto-fill, minmax(260px, 1fr))";
    grid.style.gap = "18px";

    filteredNotes.forEach(note => {
      const card = document.createElement("div");
      card.className = "card";
      card.style.position = "relative";
      card.style.transition = "transform .2s ease, box-shadow .2s ease";
      card.onmouseover = () => {
        card.style.transform = "translateY(-4px)";
        card.style.boxShadow = "0 4px 14px rgba(0,0,0,0.3)";
      };
      card.onmouseout = () => {
        card.style.transform = "translateY(0)";
        card.style.boxShadow = "none";
      };

      card.innerHTML = `
        <h3>${note.title}</h3>
        <p style="color:var(--muted); font-size:13px; margin:4px 0;">
          ${note.subject || "General"}
        </p>
        <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:8px;">
          ${(note.tags||[]).map(tag=>`<span style="
            font-size:10px;
            background:rgba(14,165,233,0.2);
            color:#0ea5e9;
            padding:2px 6px;
            border-radius:999px;
          ">${tag}</span>`).join("")}
        </div>
        <p style="margin-top:6px; opacity:.85; font-size:14px;">
          ${note.content.slice(0,150)}${note.content.length>150?"…":""}
        </p>
      `;

      // Bottom buttons container
      const btnContainer = document.createElement("div");
      btnContainer.style.display = "flex";
      btnContainer.style.justifyContent = "space-between";
      btnContainer.style.marginTop = "12px";

      // Favorite / like button
      const likeBtn = document.createElement("button");
      likeBtn.textContent = "⭐";
      likeBtn.title = "Favorite note";
      likeBtn.style.background = "transparent";
      likeBtn.style.border = "none";
      likeBtn.style.cursor = "pointer";
      likeBtn.onclick = () => {
        alert(`You favorited: ${note.title}`);
      };

      // Copy content button
      const copyBtn = document.createElement("button");
      copyBtn.textContent = "📋";
      copyBtn.title = "Copy note content";
      copyBtn.style.background = "transparent";
      copyBtn.style.border = "none";
      copyBtn.style.cursor = "pointer";
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(note.content);
        alert("Copied to clipboard!");
      };

      btnContainer.appendChild(likeBtn);
      btnContainer.appendChild(copyBtn);

      card.appendChild(btnContainer);
      grid.appendChild(card);
    });

    gridSection.appendChild(grid);
  }

  // Initial render
  renderGrid();
}
