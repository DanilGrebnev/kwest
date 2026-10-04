const MAX_PLAY_ATTEMPTS = 40;

function isSamsungBrowser(): boolean {
  return /SamsungBrowser/i.test(navigator.userAgent);
}

/** Autoplay on mobile is allowed only when sound is off — set before every play(). */
function ensureMuted(video: HTMLVideoElement) {
  video.muted = true;
  video.defaultMuted = true;
  video.volume = 0;
  video.setAttribute('muted', '');
}

function initHeroVideo() {
  const video = document.querySelector<HTMLVideoElement>('[data-hero-video]');
  if (!video) return;

  ensureMuted(video);
  video.playsInline = true;
  video.controls = false;
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');

  let attempts = 0;
  let isPlaying = false;

  const markPlaying = () => {
    isPlaying = true;
  };

  video.addEventListener('playing', markPlaying);
  video.addEventListener('timeupdate', () => {
    if (video.currentTime > 0 && !video.paused) markPlaying();
  });

  const tryPlay = () => {
    if (isPlaying || attempts >= MAX_PLAY_ATTEMPTS) return;
    if (!video.paused && video.currentTime > 0) {
      markPlaying();
      return;
    }

    ensureMuted(video);
    attempts += 1;

    const playResult = video.play();
    if (playResult === undefined) return;

    void playResult.then(() => {
      window.setTimeout(() => {
        if (!video.paused) markPlaying();
      }, 300);
    });

    window.setTimeout(() => {
      if (!video.paused || video.currentTime > 0) markPlaying();
    }, isSamsungBrowser() ? 600 : 350);
  };

  const onReady = () => tryPlay();

  video.addEventListener('loadedmetadata', onReady);
  video.addEventListener('loadeddata', onReady);
  video.addEventListener('canplay', onReady);
  video.addEventListener('canplaythrough', onReady);
  video.addEventListener('progress', () => {
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) tryPlay();
  });

  tryPlay();

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) tryPlay();
      },
      { threshold: 0.1 },
    );
    observer.observe(video);
  }

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) tryPlay();
  });

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) tryPlay();
  });

  window.addEventListener('load', tryPlay, { once: true });

  const resumeOnGesture = () => tryPlay();

  document.addEventListener('touchstart', resumeOnGesture, {
    passive: true,
    capture: true,
  });
  document.addEventListener('touchend', resumeOnGesture, {
    passive: true,
    capture: true,
  });
  document.addEventListener('scroll', resumeOnGesture, { passive: true, capture: true });

  const retryTimer = window.setInterval(() => {
    if (isPlaying || attempts >= MAX_PLAY_ATTEMPTS) {
      window.clearInterval(retryTimer);
      return;
    }
    tryPlay();
  }, 500);

  window.setTimeout(() => window.clearInterval(retryTimer), 20_000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeroVideo);
} else {
  initHeroVideo();
}
