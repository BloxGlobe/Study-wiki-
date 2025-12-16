// src/router.js
import Home from "./pages/home.js";
import Login from "./pages/login.js";
import Signup from "./pages/signup.js";
import Notes from "./pages/notes.js";
import Editor from "./pages/editor.js";
import Profile from "./pages/profile.js";
import Library from "./pages/library.js";
import NotFound from "./pages/404.js";

const routes = {
  "": Home,
  home: Home,
  notes: Notes,
  library: Library,
  projects: Editor,
  login: Login,
  signup: Signup,
  profile: Profile
};

const app = document.querySelector(".content");

export function initRouter() {
  window.addEventListener("hashchange", handleRoute);
  handleRoute(); // initial load
}

function handleRoute() {
  const route = location.hash.replace("#/", "");
  const page = routes[route] || NotFound;

  if (!app) return;

  app.innerHTML = "";
  page(app);

  updateActiveNav(route);
}

function updateActiveNav(route) {
  document.querySelectorAll(".nav-item").forEach(link => {
    const href = link.getAttribute("href")?.replace("#/", "");
    link.classList.toggle("active", href === route);
  });
}
