import re
import glob

html_files = ['landing.html', 'about.html', 'Index.html', 'careers.html', 'contact.html']

inject_css = """
  <style>
    /* Smooth Page Transition */
    body {
      animation: fadeInPage 0.4s ease-out forwards;
    }
    @keyframes fadeInPage {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
    body.fade-out {
      opacity: 0 !important;
      transition: opacity 0.4s ease-out;
    }
  </style>
</head>"""

inject_js = """
  <!-- PAGE TRANSITION SCRIPT -->
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const links = document.querySelectorAll('a');
      links.forEach(link => {
        link.addEventListener('click', function(e) {
          const href = this.getAttribute('href');
          // Only animate for internal HTML links
          if (href && href.endsWith('.html') && !this.hasAttribute('target')) {
            e.preventDefault();
            document.body.classList.add('fade-out');
            setTimeout(() => {
              window.location.href = href;
            }, 350); // Slightly less than 400ms to feel responsive
          }
        });
      });
    });

    // Fix for Safari/Firefox bfcache (back button)
    window.addEventListener('pageshow', (event) => {
      if (event.persisted) {
        document.body.classList.remove('fade-out');
      }
    });
  </script>
</body>"""

for filename in html_files:
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()

        # Inject CSS in head if not already there
        if 'fadeInPage' not in content:
            content = content.replace('</head>', inject_css)
        
        # Inject JS before body closing if not already there
        if 'PAGE TRANSITION SCRIPT' not in content:
            content = content.replace('</body>', inject_js)
            
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
            
        print(f"Updated {filename}")
    except Exception as e:
        print(f"Error updating {filename}: {e}")

print("Done!")
