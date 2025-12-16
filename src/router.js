import Home from "./pages/home.js";
import Notes from "./pages/notes.js";
import Library from "./pages/library.js";
import Projects from "./pages/Projects.js";
import Setting from "./pages/setting.js";

const routes = {
  "/home": Home,
  "/notes": Notes,
  "/library": Library,
  "/projects": Projects,
  "/setting": Setting,
};

export function router() {
  const app = document.getElementById("page-root"); // matches <section id="page-root">
  const hash = location.hash.slice(1) || "/home";
  const page = routes[hash];
  if (!page) {
    app.innerHTML = "<h2>404 - Page not found</h2>";
    return;
  }
  app.innerHTML = "";
  page(app);
}

window.addEventListener("hashchange", router);
