// src/router.js

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
  const page = location.hash.replace("#/", "") || "home";
  const target = routes[page] || routes.home;

  loadPage(target);
  updateActiveLinks(target);
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
          Missing file: <code>src/pages/${page}.js</code>
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
