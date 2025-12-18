// src/pages/library.js
import { getAllNotes } from "../utils/storage.js";
import { sanitizeText } from "../utils/filter.js";

export default function renderLibrary(container) {
  container.innerHTML = "";

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
  Object.assign(searchInput.style, {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.05)",
    background: "rgba(255,255,255,0.04)",
    color: "#fff",
    marginBottom: "16px"
  });
  topSection.appendChild(searchInput);

  // Sort select
  const sortSelect = document.createElement("select");
  Object.assign(sortSelect.style, {
    marginBottom: "16px",
    padding: "8px 12px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.05)",
    background: "rgba(255,255,255,0.04)",
    color: "#fff"
  });
  ["Newest", "Oldest", "A → Z", "Z → A"].forEach(opt => {
    const option = document.createElement("option");
    option.value = opt.toLowerCase().replace(/\s/g, "-");
    option.textContent = opt;
    sortSelect.appendChild(option);
  });
  topSection.appendChild(sortSelect);

  container.appendChild(topSection);

  // Section for note cards
  const gridSection = document.createElement("section");
  gridSection.className = "section";
  container.appendChild(gridSection);

  function renderGrid(searchTerm = "") {
    gridSection.innerHTML = "";

    // Always fetch notes fresh from storage
    let notes = getAllNotes().filter(n => n.visibility === "public");

    // Filter
    const term = (searchTerm || "").toLowerCase();
    notes = notes.filter(note => {
      return (note.title||'').toLowerCase().includes(term)
        || (note.subject||'').toLowerCase().includes(term)
        || (note.content||'').toLowerCase().includes(term);
    });

    // Sort helper
    const ts = n => n && n.createdAt ? Number(n.createdAt) || 0 : Number(n.id) || 0;

    switch(sortSelect.value){
      case "oldest": notes.sort((a,b)=>ts(a)-ts(b)); break;
      case "a-→-z": notes.sort((a,b)=>String(a.title||'').localeCompare(String(b.title||''))); break;
      case "z-→-a": notes.sort((a,b)=>String(b.title||'').localeCompare(String(a.title||''))); break;
      default: notes.sort((a,b)=>ts(b)-ts(a)); // newest
    }

    if(notes.length === 0){
      const empty = document.createElement("div");
      empty.className = "placeholder";
      empty.textContent = "No public notes found.";
      gridSection.appendChild(empty);
      return;
    }

    const grid = document.createElement("div");
    Object.assign(grid.style, {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
      gap: "18px"
    });

    notes.forEach(note => {
      const card = document.createElement("div");
      card.className = "card";
      Object.assign(card.style, {
        position: "relative",
        transition: "transform .2s ease, box-shadow .2s ease"
      });
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
          ${sanitizeText(note.content||'').slice(0,150)}${(note.content||'').length>150?"…":""}
        </p>
      `;

      // Buttons
      const btnContainer = document.createElement("div");
      Object.assign(btnContainer.style, {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "12px"
      });

      const likeBtn = document.createElement("button");
      likeBtn.textContent = "⭐";
      likeBtn.title = "Favorite note";
      Object.assign(likeBtn.style, { background:"transparent", border:"none", cursor:"pointer" });
      likeBtn.onclick = () => alert(`You favorited: ${note.title}`);

      const copyBtn = document.createElement("button");
      copyBtn.textContent = "📋";
      copyBtn.title = "Copy note content";
      Object.assign(copyBtn.style, { background:"transparent", border:"none", cursor:"pointer" });
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

  // Listeners
  searchInput.addEventListener("input", ()=>renderGrid(searchInput.value));
  sortSelect.addEventListener("change", ()=>renderGrid(searchInput.value));

  // Initial render
  renderGrid();
}
