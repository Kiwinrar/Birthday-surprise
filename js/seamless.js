// Seamless HTML5 Page Transitions with 100% Uninterrupted Audio
(function() {
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
      return;
    }

    // Ignore external links
    if (href.startsWith('http://') || href.startsWith('https://')) {
      try {
        const url = new URL(href);
        if (url.origin !== window.location.origin) return;
      } catch (err) {
        return;
      }
    }

    // Ignore keyboard modifiers (cmd/ctrl click for new tab)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    e.preventDefault();
    navigateTo(href);
  });

  // Handle browser Back / Forward buttons
  window.addEventListener('popstate', function() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    loadPage(currentPath, false);
  });

  function navigateTo(url) {
    history.pushState(null, '', url);
    loadPage(url, true);
  }

  window.navigateToPage = navigateTo;

  function loadPage(url, isNewState) {
    const container = document.querySelector('.page-container');
    if (container) {
      container.style.transition = 'opacity 0.15s ease-out, transform 0.15s ease-out';
      container.style.opacity = '0';
      container.style.transform = 'scale(0.98)';
    }

    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error('Page fetch failed: ' + response.status);
        return response.text();
      })
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        if (doc.title) {
          document.title = doc.title;
        }

        // Update body class for background styling (bg-gingham, bg-damask, bg-split)
        document.body.className = doc.body.className;

        const newContainer = doc.querySelector('.page-container');
        if (newContainer && container) {
          // Make sure any modals or overlays in doc.body are included
          const modals = doc.querySelectorAll('.modal-overlay, .flash-overlay');
          modals.forEach(m => {
            if (!newContainer.contains(m)) {
              newContainer.appendChild(m.cloneNode(true));
            }
          });

          container.innerHTML = newContainer.innerHTML;

          // Re-execute page-specific inline scripts in global scope
          const scripts = doc.querySelectorAll('script');
          scripts.forEach(script => {
            const src = script.getAttribute('src');
            // Skip music.js and seamless.js as they are already running
            if (src && (src.includes('music.js') || src.includes('seamless.js'))) {
              return;
            }
            if (src) {
              const newScript = document.createElement('script');
              newScript.src = src;
              document.head.appendChild(newScript);
            } else if (script.textContent.trim()) {
              try {
                // Execute in global window context so onclick handlers work
                window.eval(script.textContent);
              } catch (err) {
                console.error('Error executing page script:', err);
              }
            }
          });

          // Sync music pill state without interrupting audio
          if (window.BdayMusic) {
            const disc = document.querySelector('.vinyl-disc');
            const label = document.querySelector('.music-label');
            const audio = window.BdayMusic.getAudio();
            const isPlaying = audio && !audio.paused;
            if (disc) {
              if (isPlaying) disc.classList.remove('paused');
              else disc.classList.add('paused');
            }
            if (label) {
              label.textContent = isPlaying ? 'Music: Playing ♪' : 'Music: Paused';
            }
          }

          // Animate into view
          container.style.opacity = '0';
          container.style.transform = 'scale(1.02)';
          requestAnimationFrame(() => {
            container.style.transition = 'opacity 0.25s ease-in, transform 0.25s ease-out';
            container.style.opacity = '1';
            container.style.transform = 'scale(1)';
          });

          window.scrollTo(0, 0);
        } else {
          window.location.href = url;
        }
      })
      .catch(err => {
        console.error('Seamless transition error, fallback:', err);
        window.location.href = url;
      });
  }
})();
