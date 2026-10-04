const root = document.documentElement;

function measureHeaderHeight(): number {
  const header = document.querySelector<HTMLElement>('[data-header]');
  return header?.getBoundingClientRect().height ?? 72;
}

function getVideoAspect(): number | null {
  const video = document.querySelector<HTMLVideoElement>('[data-hero-video]');
  if (!video?.videoWidth || !video?.videoHeight) return null;
  return video.videoWidth / video.videoHeight;
}

function updateHeroMediaVars(vw: number, mediaHeight: number) {
  const frame = document.querySelector<HTMLElement>('[data-hero-video-frame]');
  const aspect = getVideoAspect() ?? 9 / 16;

  const naturalWidth = mediaHeight * aspect;
  const width = Math.min(vw, naturalWidth);
  const useCover = naturalWidth > vw;

  root.style.setProperty('--hero-media-width', `${width}px`);
  frame?.setAttribute('data-fit', useCover ? 'cover' : 'contain');
}

/** Стабильные размеры без скачков от горизонтального скроллбара во время анимаций. */
function readViewportSize() {
  const vw = document.documentElement.clientWidth;
  const vh = Math.round(
    window.visualViewport?.height ?? document.documentElement.clientHeight,
  );

  return { vw, vh };
}

let lastVw = 0;
let lastVh = 0;

function setViewportVars() {
  const { vw, vh } = readViewportSize();

  if (Math.abs(vw - lastVw) < 1 && Math.abs(vh - lastVh) < 1) {
    return;
  }

  lastVw = vw;
  lastVh = vh;

  const headerHeight = measureHeaderHeight();
  const mediaHeight = Math.max(0, vh - headerHeight);

  root.style.setProperty('--app-vw', `${vw}px`);
  root.style.setProperty('--app-vh', `${vh}px`);
  root.style.setProperty('--app-header-height', `${headerHeight}px`);
  root.style.setProperty('--hero-media-height', `${mediaHeight}px`);

  updateHeroMediaVars(vw, mediaHeight);
}

let resizeTimer: ReturnType<typeof setTimeout> | undefined;

function scheduleViewportVars() {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(setViewportVars, 80);
}

function init() {
  setViewportVars();

  window.addEventListener('resize', scheduleViewportVars, { passive: true });
  window.addEventListener('orientationchange', setViewportVars);
  window.visualViewport?.addEventListener('resize', scheduleViewportVars);

  const video = document.querySelector<HTMLVideoElement>('[data-hero-video]');
  if (video) {
    if (video.readyState >= 1) setViewportVars();
    video.addEventListener('loadedmetadata', setViewportVars);
  }
}

init();
