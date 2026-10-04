const MAX_PLAY_ATTEMPTS = 12;

function initHeroVideo() {
  const video = document.querySelector<HTMLVideoElement>('[data-hero-video]');
  if (!video) return;

  video.muted = true;
  video.defaultMuted = true;
  video.volume = 0;
  video.playsInline = true;
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');
  video.setAttribute('x5-playsinline', '');

  let attempts = 0;

  const tryPlay = () => {
    if (attempts >= MAX_PLAY_ATTEMPTS) return;
    attempts += 1;

    if (!video.paused && !video.ended) return;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      void playPromise.catch(() => {
        /* iOS / Low Power Mode / HTTP preview may defer autoplay until gesture. */
      });
    }
  };

  const bindPlayOnReady = () => {
    tryPlay();
    video.addEventListener('loadedmetadata', tryPlay);
    video.addEventListener('loadeddata', tryPlay);
    video.addEventListener('canplay', tryPlay);
    video.addEventListener('canplaythrough', tryPlay);
  };

  bindPlayOnReady();

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          tryPlay();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
  }

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) tryPlay();
  });

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) tryPlay();
  });

  const resumeOnGesture = () => tryPlay();

  document.addEventListener('touchstart', resumeOnGesture, {
    passive: true,
    capture: true,
  });
  document.addEventListener('touchend', resumeOnGesture, {
    passive: true,
    capture: true,
  });
  document.addEventListener('click', resumeOnGesture, { capture: true });

  const retryTimer = window.setInterval(() => {
    if (!video.paused || attempts >= MAX_PLAY_ATTEMPTS) {
      window.clearInterval(retryTimer);
      return;
    }
    tryPlay();
  }, 800);

  window.setTimeout(() => window.clearInterval(retryTimer), 10_000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeroVideo);
} else {
  initHeroVideo();
}
