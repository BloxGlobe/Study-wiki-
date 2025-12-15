// src/router.js
import Home from "./pages/home.js";
import Login from "./pages/login.js";
import Signup from "./pages/signup.js";
import Notes from "./pages/notes.js";
import Editor from "./pages/editor.js";
import Profile from "./pages/profile.js";
import NotFound from "./pages/404.js";

const routes = {
  home: Home,
  search: Notes,
  library: Notes,
  projects: Editor,
  login: Login,
  signup: Signup,
  profile: Profile
};

const app = document.getElementById("app");
const title = document.getElementById("page-title");

export function initRouter() {
  const hash = location.hash.replace("#/", "") || "home";
  loadRoute(hash);

  window.addEventListener("hashchange", () => {
    const route = location.hash.replace("#/", "") || "home";
    loadRoute(route);
  });
}

export function navigate(route) {
  location.hash = `/${route}`;
}

function loadRoute(route) {
  const page = routes[route] || NotFound;

  // Clear existing content
  app.innerHTML = "";

  // Render page
  page(app);

  // Update title
  title.textContent = capitalize(route);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
