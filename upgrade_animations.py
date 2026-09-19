import re

files_to_upgrade_navbar = ['about.html', 'Index.html', 'careers.html', 'contact.html']
all_files = ['landing.html', 'about.html', 'Index.html', 'careers.html', 'contact.html']

new_nav_css = """    .nav-center-menu {
      display: flex;
      align-items: center;
      gap: 32px;
      list-style: none;
      margin: 0;
      padding: 0;
      position: relative;
    }
    .nav-center-menu li {
      position: relative;
    }
    .nav-center-menu a {
      font-size: 0.95rem;
      font-weight: 500;
      color: #63584F;
      text-decoration: none;
      transition: color 0.25s ease, transform 0.25s ease;
      padding: 6px 4px;
      display: inline-block;
      position: relative;
      z-index: 2;
    }
    .nav-center-menu a:hover {
      color: var(--primary);
    }
    .nav-center-menu a.active {
      color: var(--primary);
      font-weight: 700;
    }
    .nav-glider {
      position: absolute;
      bottom: -3px;
      left: 0;
      height: 2.5px;
      background: linear-gradient(90deg, var(--secondary), var(--primary));
      border-radius: 9999px;
      box-shadow: 0 2px 8px rgba(43, 33, 28, 0.25);
      transition: transform 0.35s cubic-bezier(0.25, 1, 0.5, 1),
                  width 0.35s cubic-bezier(0.25, 1, 0.5, 1),
                  opacity 0.25s ease;
      pointer-events: none;
      z-index: 1;
      opacity: 0;
      transform: translateX(0);
    }"""

new_glider_js = """
  <!-- GLIDER SCRIPT -->
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const navMenu = document.querySelector('.nav-center-menu');
      const glider = document.getElementById('navGlider');
      const navLinks = navMenu ? navMenu.querySelectorAll('a') : [];

      function positionGliderTo(linkEl) {
        if (!glider || !linkEl || !navMenu) return;
        const menuRect = navMenu.getBoundingClientRect();
        const linkRect = linkEl.getBoundingClientRect();
        const leftOffset = linkRect.left - menuRect.left;
        const width = linkRect.width;

        glider.style.opacity = '1';
        glider.style.width = `${width}px`;
        glider.style.transform = `translateX(${leftOffset}px)`;
      }

      const activeLink = navMenu ? navMenu.querySelector('a.active') : null;
      if (activeLink) {
        setTimeout(() => positionGliderTo(activeLink), 120);
      }

      navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => positionGliderTo(link));
      });

      if (navMenu) {
        navMenu.addEventListener('mouseleave', () => {
          const currentActive = navMenu.querySelector('a.active');
          if (currentActive) {
            positionGliderTo(currentActive);
          } else if (glider) {
            glider.style.opacity = '0';
          }
        });
      }

      window.addEventListener('resize', () => {
        const currentActive = navMenu ? navMenu.querySelector('a.active') : null;
        if (currentActive) positionGliderTo(currentActive);
      });
    });
  </script>
"""

new_transition_css = """
  <style>
    /* Smooth Premium Page Transition */
    body {
      animation: fadeInPage 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }
    @keyframes fadeInPage {
      0% { opacity: 0; transform: translateY(12px) scale(0.995); filter: blur(3px); }
      100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
    }
    body.fade-out {
      opacity: 0 !important;
      transform: translateY(-8px) scale(0.995) !important;
      filter: blur(2px) !important;
      transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1) !important;
    }
  </style>
</head>"""

for filename in files_to_upgrade_navbar:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Replace CSS
    content = re.sub(
        r'\.nav-center-menu \{.*?\.nav-center-menu a\.active::after \{.*?\}',
        new_nav_css,
        content,
        flags=re.DOTALL
    )

    # 2. Add glider HTML to the ul if not present
    if 'id="navGlider"' not in content:
        content = re.sub(
            r'(<ul[^>]*class="[^"]*nav-center-menu[^"]*"[^>]*>.*?)(</ul>)',
            r'\1  <span class="nav-glider" id="navGlider"></span>\n      \2',
            content,
            flags=re.DOTALL
        )
    
    # 3. Add glider JS if not present
    if 'GLIDER SCRIPT' not in content:
        content = content.replace('</body>', new_glider_js + '\n</body>')

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)


# 4. Update transition CSS in all files
for filename in all_files:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the old transition CSS and replace it
    content = re.sub(
        r'<style>\s*/\*\s*Smooth Page Transition\s*\*/.*?</style>\s*</head>',
        new_transition_css,
        content,
        flags=re.DOTALL
    )
    
    # Update setTimeout in page transition script from 350 to 450
    content = content.replace('350); // Slightly less than 400ms', '450); // Match animation length')

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

print("Navbar upgraded and premium transitions applied to all files!")
