// src/utils/loadCSS.js
export function loadCSS(href, id) {
  if (id && document.getElementById(id)) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  if (id) link.id = id;

  document.head.appendChild(link);
}
