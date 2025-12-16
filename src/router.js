import Home from "./pages/home.js";
import Notes from "./pages/feature/notes.js";
import AuthPage from "./pages/feature/auth.js";
import Editor from "./pages/feature/editor.js";
import Moderator from "./pages/feature/moderator.js";
import Library from "./pages/library.js";
import Projects from "./pages/Projects.js";
import Setting from "./pages/setting.js";
import Blocky from "./pages/blocky.js";
import Signup from "./pages/feature/signup.js";
import Banned from "./pages/feature/banned.js";

const routes = {
  "/home": Home,
  "/notes": Notes,
  "/library": Library,
  "/projects": Projects,
  "/auth": AuthPage,
  "/signup": Signup,
  "/moderator": Moderator,
  "/blocky": Blocky,
  "/banned": Banned,
  "/setting": Setting,
};

export function router() {
  const app = document.getElementById("page-root"); // matches <section id="page-root">
  const hash = location.hash.slice(1) || "/home";
  // exact match first
  const page = routes[hash];
  if (page) {
    app.innerHTML = "";
    page(app);
    return;
  }

  // editor route: /editor/:id
  if (hash.startsWith("/editor/")) {
    const id = hash.replace("/editor/", "");
    app.innerHTML = "";
    Editor(app, id);
    return;
  }

  app.innerHTML = "<h2>404 - Page not found</h2>";
}

window.addEventListener("hashchange", router);
