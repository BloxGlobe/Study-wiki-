// src/Pages/home.js

export default function render(container) {
  container.innerHTML = `
    <div class="card">

      <h2 style="font-size:1.6rem; margin-bottom:0.25rem;">
        Home
      </h2>

      <p class="placeholder" style="font-size:0.9rem; margin-top:0;">
        Welcome to Study Wiki.
      </p>

      <div style="font-size:0.9rem; margin-top:0.75rem; line-height:1.55;">

        <!-- Getting Started -->
        <h3 style="font-size:1.15rem; margin-top:1rem;">
          Getting Started
        </h3>
        <p>
          Explore your study materials, organize projects, and collaborate with your community.
        </p>

        <div style="border-bottom:1px solid rgba(255,255,255,0.08); margin:0.75rem 0;"></div>

        <!-- Features -->
        <h3 style="font-size:1.15rem; margin-top:0.75rem;">
          Features
        </h3>
        <ul style="margin-left:1.25rem; padding-left:0;">
          <li>Create and manage study projects</li>
          <li>Build your personal library</li>
          <li>Use interactive tools and Blocky editor</li>
          <li>Connect with communities</li>
          <li>Browse the marketplace</li>
        </ul>

        <div style="border-bottom:1px solid rgba(255,255,255,0.08); margin:0.75rem 0;"></div>

        <!-- Quick Links -->
        <h3 style="font-size:1.15rem; margin-top:0.75rem;">
          Quick Links
        </h3>
        <p>
          Use the navigation menu to access different sections of Study Wiki.
        </p>

      </div>
    </div>
  `;
}
