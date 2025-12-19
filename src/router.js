// src/router.js
import home, { showhome, close } from "./Pages/home.js"
import creations, { showcreations, close } from "./Pages/creations.js"
import library, { showlibrary, close } from "./Pages/library.js"
import project, { showproject, close } from "./Pages/project.js"
import settings, { showsettings, close } from "./Pages/settings.js"
import tools, { showtools, close } from "./Pages/tools.js"
import blocky, { showblocky, close } from "./Pages/blocky.js"
import communities, { showcommunities, close } from "./Pages/communities.js"
import marketplace, { showmarketplace, close } from "./Pages/marketplace.js"

const routes = {
  home: "home",
  creations: "creations",
  library: "library",
  projects: "projects",
  settings: "settings",
  tools: "tools",
  blocky: "blocky",
  communities: "communities",
  marketplace: "marketplace",
};

export default function initRouter() {
  window.addEventListener("hashchange", handleRoute);
  handleRoute(); // initial load
}

function handleRoute() {
  const page = location.hash.replace("#", "") || "home";
  const target = routes[page] || routes.home;

  loadPage(target);
  updateActiveLinks(target);
}

async function loadPage(page) {
  const root = document.getElementById("page-root");
  if (!root) return;

  root.innerHTML = `<div class="placeholder">Loading page...</div>`;

  try {
    // Fixed: correct folder case
    const module = await import(`/src/Pages/${page}.js`);
    root.innerHTML = "";
    module.default(root);
  } catch (err) {
    root.innerHTML = `
      <div class="card">
        <h3>Page not found</h3>
        <p class="placeholder">
          Missing file: <code>src/Pages/${page}.js</code>
        </p>
      </div>
    `;
    console.error(err);
  }
}

function updateActiveLinks(page) {
  document.querySelectorAll("[data-page]").forEach(link => {
    link.classList.toggle("active", link.dataset.page === page);
  });

  document.querySelectorAll(".top-link").forEach(link => {
    const target = link.getAttribute("href")?.replace("/#", "");
    link.classList.toggle("active", target === page);
  });
}
