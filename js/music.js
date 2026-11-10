// Shared Background Music Controller across all endpoints
(function() {
  const AUDIO_SRC = 'music.mp3';
  let audio = null;
  let isPlaying = false;

  function initAudio() {
    audio = new Audio(AUDIO_SRC);
    audio.loop = true;
    audio.preload = 'auto';

    // Retrieve saved state - DEFAULT TO TRUE (Music ON by default)
    const savedTime = parseFloat(localStorage.getItem('bday_audio_time') || '0');
    const isExplicitlyPaused = localStorage.getItem('bday_audio_playing') === 'false';
    const shouldPlay = !isExplicitlyPaused;

    if (!isNaN(savedTime) && savedTime > 0) {
      audio.currentTime = savedTime;
    }

    // Continuously save time
    audio.addEventListener('timeupdate', () => {
      if (!audio.paused) {
        localStorage.setItem('bday_audio_time', audio.currentTime.toString());
      }
    });

    audio.addEventListener('play', () => {
      isPlaying = true;
      localStorage.setItem('bday_audio_playing', 'true');
      updatePillUI(true);
    });

    audio.addEventListener('pause', () => {
      isPlaying = false;
      // Only set to false if explicitly paused by user action
      updatePillUI(false);
    });

    // Start playback by default
    if (shouldPlay) {
      startPlayback();
    }

    renderMusicPill();
  }

  function startPlayback() {
    if (!audio) return;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isPlaying = true;
          localStorage.setItem('bday_audio_playing', 'true');
          updatePillUI(true);
        })
        .catch(() => {
          // Browser autoplay restriction before user interaction
          // Automatically start on the very first tap/click anywhere
          const autoPlayOnInteraction = () => {
            if (localStorage.getItem('bday_audio_playing') !== 'false') {
              audio.play().then(() => {
                isPlaying = true;
                localStorage.setItem('bday_audio_playing', 'true');
                updatePillUI(true);
              }).catch(() => {});
            }
            ['click', 'touchstart', 'pointerdown', 'keydown'].forEach(evt => {
              window.removeEventListener(evt, autoPlayOnInteraction);
            });
          };

          ['click', 'touchstart', 'pointerdown', 'keydown'].forEach(evt => {
            window.addEventListener(evt, autoPlayOnInteraction, { once: true, passive: true });
          });
        });
    }
  }

  function toggleMusic() {
    if (!audio) return;
    if (audio.paused) {
      localStorage.setItem('bday_audio_playing', 'true');
      audio.play().catch(e => console.log('Audio play error:', e));
    } else {
      localStorage.setItem('bday_audio_playing', 'false');
      audio.pause();
    }
  }

  function updatePillUI(playing) {
    const disc = document.querySelector('.vinyl-disc');
    const label = document.querySelector('.music-label');
    if (disc) {
      if (playing) {
        disc.classList.remove('paused');
      } else {
        disc.classList.add('paused');
      }
    }
    if (label) {
      label.textContent = playing ? 'Music: Playing ♪' : 'Music: Paused';
    }
  }

  function renderMusicPill() {
    let header = document.querySelector('.floating-header');
    if (!header) {
      header = document.createElement('div');
      header.className = 'floating-header';
      document.body.prepend(header);
    }

    if (!header.querySelector('.music-pill')) {
      const isExplicitlyPaused = localStorage.getItem('bday_audio_playing') === 'false';
      const musicPill = document.createElement('div');
      musicPill.className = 'music-pill';
      musicPill.title = 'Click to toggle music';
      musicPill.innerHTML = `
        <span class="vinyl-disc ${isExplicitlyPaused ? 'paused' : ''}"></span>
        <span class="music-label">${isExplicitlyPaused ? 'Music: Paused' : 'Music: Playing ♪'}</span>
      `;
      musicPill.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMusic();
      });
      header.appendChild(musicPill);
    }
  }

  window.BdayMusic = {
    play: () => {
      localStorage.setItem('bday_audio_playing', 'true');
      if (audio) audio.play();
    },
    pause: () => {
      localStorage.setItem('bday_audio_playing', 'false');
      if (audio) audio.pause();
    },
    toggle: toggleMusic,
    getAudio: () => audio
  };

  document.addEventListener('DOMContentLoaded', initAudio);
})();
