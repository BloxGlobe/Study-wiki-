// src/router.js

const routes = {
  home: () => loadPage("home"),
  creations: () => loadPage("creations"),
  library: () => loadPage("library"),
  projects: () => loadPage("projects"),
  settings: () => loadPage("settings"),
  tools: () => loadPage("tools"),
  blocky: () => loadPage("blocky"),
  communities: () => loadPage("communities")
  marketplace: () => loadPage("marketplace")
};

export default function initRouter() {
  window.addEventListener("hashchange", handleRoute);
  handleRoute(); // initial load
}

function handleRoute() {
  const hash = location.hash.replace("#/", "") || "home";
  const route = routes[hash] || routes.home;

  route();
  updateActiveLinks(hash);
}

async function loadPage(page) {
  const root = document.getElementById("page-root");
  if (!root) return;

  root.innerHTML = `<div class="placeholder">Loading…</div>`;

  try {
    const module = await import(`./pages/${page}.js`);
    root.innerHTML = "";
    module.default(root);
  } catch (err) {
    root.innerHTML = `
      <div class="card">
        <h3>Page not found</h3>
        <p class="placeholder">
          The page "<b>${page}</b>" does not exist yet.
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
    const target = link.getAttribute("href")?.replace("#/", "");
    link.classList.toggle("active", target === page);
  });
}
