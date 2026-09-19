import os

files = ['index.html', 'menu.html', 'about.html', 'careers.html']

css_overrides = """
    /* Mobile Responsiveness Overrides */
    .mobile-menu-toggle {
      display: none;
      color: var(--primary);
      padding: 4px;
    }
    
    @media (max-width: 900px) {
      .mobile-menu-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .nav-inner {
        flex-wrap: wrap;
      }
      .nav-center-menu {
        display: none;
        flex-direction: column;
        width: 100%;
        order: 4;
        background: rgba(246, 241, 232, 0.98);
        padding: 20px 0;
        margin-top: 16px;
        box-shadow: 0 12px 24px rgba(43, 33, 28, 0.08);
        border-top: 1px solid rgba(43,33,28,0.06);
        border-radius: 0 0 16px 16px;
        position: absolute;
        top: 100%;
        left: 0;
        z-index: 99;
      }
      .nav-center-menu.is-open {
        display: flex;
        animation: fadeDown 0.3s ease;
      }
      @keyframes fadeDown {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .nav-glider {
        display: none !important;
      }
      
      /* Specific Overrides for Pages */
      .hero-watermark {
        font-size: 15vw !important;
        white-space: normal !important;
        line-height: 1 !important;
        opacity: 0.03 !important;
      }
      .floating-bean {
        display: none !important;
      }
      .app-preview-wrapper img {
        max-width: 100% !important;
        height: auto !important;
      }
      .drink-img {
        max-width: 100%;
        aspect-ratio: 1;
        object-fit: contain;
      }
      .timeline-step {
        padding-left: 20px !important;
      }
      .timeline-number {
        left: -15px !important;
      }
      .step-header {
        scroll-margin-top: 100px; /* Fix for sticky header */
      }
    }
    
    @media (max-width: 600px) {
      .menu-grid {
        grid-template-columns: 1fr !important;
      }
      .about-hero {
        padding: 120px 20px 60px !important;
      }
      .filter-buttons {
        flex-wrap: wrap;
        justify-content: flex-start;
      }
    }
</style>
"""

js_overrides = """
  <!-- Mobile Menu Toggle Script -->
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const mobileBtn = document.getElementById('mobileMenuBtn');
      const navMenu = document.querySelector('.nav-center-menu');
      if(mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', () => {
          navMenu.classList.toggle('is-open');
        });
      }
    });
  </script>
</body>
"""

html_btn = """        <div class="nav-right-cluster" style="gap: 16px;">
          <button class="mobile-menu-toggle" id="mobileMenuBtn" aria-label="Toggle Menu">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          <div class="lang-divider-switch">"""

for file in files:
    if not os.path.exists(file):
        continue
        
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Prevent duplicate insertions
    if 'mobile-menu-toggle' not in content:
        # Replace the start of nav-right-cluster
        content = content.replace(
            '<div class="nav-right-cluster">\n          <div class="lang-divider-switch">',
            html_btn
        )
        
        # Inject CSS
        content = content.replace('</style>', css_overrides)
        
        # Inject JS
        content = content.replace('</body>', js_overrides)
        
        # Also remove the existing media query that breaks nav-center-menu (we replaced it with our comprehensive one)
        # Search for: 
        #    @media (max-width: 900px) {
        #      .nav-inner {
        #        flex-wrap: wrap;
        #      }
        #      .nav-center-menu {
        #        order: 3;
        # ...
        #    }
        # It's easier to just let our CSS override it using order: 4, display: none and !important if needed. 
        # The display: none will hide it initially anyway.

        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Patched {file}")
    else:
        print(f"Skipped {file} (already patched)")

print("Done.")
