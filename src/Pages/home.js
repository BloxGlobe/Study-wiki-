// src/Pages/home.js
export default function render(container) {
  container.innerHTML = `
    <div class="card">
      <h2 style="font-family: 'Segoe UI', Tahoma, Geneva, sans-serif; font-size: 1.98rem;">Home</h2>
      <p class="placeholder" style="font-family: 'Segoe UI', Tahoma, Geneva, sans-serif; font-size: 0.99rem;">Welcome to Study Wiki.</p>
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, sans-serif; font-size: 0.99rem; margin-top: 1rem; line-height: 1.6;">
        <h3 style="font-size: 1.485rem; margin-top: 1rem;">Getting Started</h3>
        <p>Explore your study materials, organize your projects, and collaborate with your community.</p>
        
        <h3 style="font-size: 1.485rem; margin-top: 1rem;">Features</h3>
        <ul style="margin-left: 1.5rem;">
          <li>Create and manage study projects</li>
          <li>Build your personal library</li>
          <li>Use interactive tools and blocky editor</li>
          <li>Connect with communities</li>
          <li>Browse the marketplace</li>
        </ul>
        
        <h3 style="font-size: 1.485rem; margin-top: 1rem;">Quick Links</h3>
        <p>Navigate using the menu above to access different sections of Study Wiki.</p>
      </div>
    </div>
  `;
}