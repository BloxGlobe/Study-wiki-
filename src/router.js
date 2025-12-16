// src/router.js

import Home from "./pages/home.js";
import Login from "./pages/login.js";
import Signup from "./pages/signup.js";
import Notes from "./pages/notes.js";
import Library from "./pages/library.js";
import Editor from "./pages/editor.js";
import Profile from "./pages/profile.js";
import NotFound from "./pages/404.js";

const routes = {
  "": Home,
  home: Home,
  login: Login,
  signup: Signup,
  notes: Notes,
  library: Library,
  projects: Editor,
  editor: Editor,
  profile: Profile
};

let outlet = null;

export function initRouter() {
  outlet = document.querySelector(".content");

  if (!outlet) {
    console.error("Router error: .content container not found");
    return;
  }

  window.addEventListener("hashchange", resolveRoute);
  resolveRoute(); // initial load
}

function resolveRoute() {
  const route = location.hash.replace("#/", "");
  const page = routes[route] || NotFound;

  outlet.innerHTML = "";

  try {
    page(outlet);
  } catch (err) {
    console.error(`Error rendering route "${route}"`, err);
    NotFound(outlet);
  }

  updateActiveNav(route);
}

function updateActiveNav(route) {
  document.querySelectorAll(".nav-item").forEach(link => {
    const href = link.getAttribute("href")?.replace("#/", "");
    link.classList.toggle("active", href === route);
  });
}
