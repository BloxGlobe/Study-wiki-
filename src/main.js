// src/main.js

import initRouter from "./router.js";

document.addEventListener("DOMContentLoaded", () => {
  initRouter();
  setupSearchDropdown();
});

function setupSearchDropdown() {
  const searchInput = document.querySelector(".search input");
  const dropdown = document.querySelector(".search-dropdown");

  if (!searchInput || !dropdown) return;

  searchInput.addEventListener("focus", () => {
    dropdown.style.display = "block";
  });

  searchInput.addEventListener("blur", () => {
    // small delay so clicks inside dropdown work later
    setTimeout(() => {
      dropdown.style.display = "none";
    }, 150);
  });
}
