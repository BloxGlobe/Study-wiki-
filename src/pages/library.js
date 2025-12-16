// src/pages/library.js

import { getAllNotes } from "../utils/storage.js";

export default function renderLibrary(container) {
  container.innerHTML = "";

  const notes = getAllNotes().filter(n => n.visibility === "public");

  const section = document.createElement("section");
  section.className = "section";

  const title = document.createElement("h2");
  title.textContent = "Public Library";
  title.style.marginBottom = "18px";

  section.appendChild(title);

  if (notes.length === 0) {
    const empty = document.createElement("div");
    empty.className = "placeholder";
    empty.textContent = "No public notes yet.";
    section.appendChild(empty);
  } else {
    const grid = document.createElement("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(auto-fill, minmax(260px, 1fr))";
    grid.style.gap = "18px";

    notes.forEach(note => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <h3>${note.title}</h3>
        <p style="color:var(--muted);font-size:14px">
          ${note.subject || "General"}
        </p>
        <p style="margin-top:10px;opacity:.85">
          ${note.content.slice(0, 120)}${note.content.length > 120 ? "…" : ""}
        </p>
      `;

      grid.appendChild(card);
    });

    section.appendChild(grid);
  }

  container.appendChild(section);
}
