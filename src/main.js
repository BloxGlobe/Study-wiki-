// src/main.js
import { initRouter, navigate } from "./router.js";

document.addEventListener("DOMContentLoaded", () => {
  initRouter();

  // Sidebar navigation handling
  document.querySelectorAll(".nav-item").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();

      const route = link.getAttribute("data-route");
      navigate(route);

      // active state
      document.querySelectorAll(".nav-item").forEach(l =>
        l.classList.remove("active")
      );
      link.classList.add("active");
    });
  });
});
