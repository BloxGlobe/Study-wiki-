let modalEl = null;

function ensure() {
  if (modalEl) return modalEl;
  modalEl = document.createElement("div");
  modalEl.className = "app-modal";
  modalEl.style.position = "fixed";
  modalEl.style.inset = "0";
  modalEl.style.display = "flex";
  modalEl.style.alignItems = "center";
  modalEl.style.justifyContent = "center";
  modalEl.style.zIndex = "9999";
  modalEl.style.background = "rgba(0,0,0,0.45)";

  const inner = document.createElement("div");
  inner.className = "app-modal-inner";
  inner.style.background = "var(--surface, #0f1113)";
  inner.style.padding = "18px";
  inner.style.borderRadius = "10px";
  inner.style.minWidth = "320px";
  inner.style.maxWidth = "720px";
  inner.style.boxShadow = "0 8px 30px rgba(0,0,0,0.6)";
  inner.addEventListener("click", e => e.stopPropagation());

  modalEl.appendChild(inner);
  modalEl.addEventListener("click", () => close());
  document.body.appendChild(modalEl);
  return modalEl;
}

export function showModal(content) {
  const m = ensure();
  const inner = m.querySelector(".app-modal-inner");
  if (typeof content === "string") inner.innerHTML = content;
  else {
    inner.innerHTML = "";
    inner.appendChild(content);
  }
  m.style.display = "flex";
  document.body.style.overflow = "hidden";
}

export function close() {
  if (!modalEl) return;
  modalEl.style.display = "none";
  document.body.style.overflow = "";
}

export default { showModal, close };
