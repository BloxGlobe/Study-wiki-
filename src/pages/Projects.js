export default function Projects(container) {
  container.innerHTML = `
    <section class="section">
      <div class="section-head">
        <h2>Projects</h2>
        <button id="new-project" class="btn-primary">New</button>
      </div>

      <div class="card">
        <form id="project-form" style="display:none" class="stack">
          <input
            id="project-title"
            placeholder="Project title"
            required
          />

          <textarea
            id="project-content"
            placeholder="Write your notes here..."
            rows="5"
          ></textarea>

          <label class="inline">
            <input type="checkbox" id="project-public" />
            <span>Make public</span>
          </label>

          <div class="row">
            <button type="submit" class="btn-primary">Save</button>
            <button type="button" id="cancel-project" class="btn">Cancel</button>
          </div>
        </form>

        <div id="projects-list" class="list muted">
          No projects yet.
        </div>
      </div>
    </section>
  `;

  const form = container.querySelector("#project-form");
  const list = container.querySelector("#projects-list");

  function loadProjects() {
    return JSON.parse(localStorage.getItem("projects") || "[]");
  }

  function saveProjects(projects) {
    localStorage.setItem("projects", JSON.stringify(projects));
  }

  function renderProjects() {
    const projects = loadProjects();
    if (!projects.length) {
      list.textContent = "No projects yet.";
      return;
    }

    list.innerHTML = projects
      .map(
        p => `
        <div class="list-item">
          <strong>${p.title}</strong>
          <span class="badge ${p.public ? "badge-public" : "badge-private"}">
            ${p.public ? "Public" : "Private"}
          </span>
        </div>
      `
      )
      .join("");
  }

  container.querySelector("#new-project").onclick = () => {
    form.style.display = "flex";
  };

  container.querySelector("#cancel-project").onclick = () => {
    form.reset();
    form.style.display = "none";
  };

  form.onsubmit = e => {
    e.preventDefault();

    const title = container.querySelector("#project-title").value.trim();
    const content = container.querySelector("#project-content").value.trim();
    const isPublic = container.querySelector("#project-public").checked;

    if (!title) return;

    const projects = loadProjects();
    projects.push({
      id: Date.now(),
      title,
      content,
      public: isPublic,
      createdAt: Date.now()
    });

    saveProjects(projects);
    form.reset();
    form.style.display = "none";
    renderProjects();
  };

  renderProjects();
}
