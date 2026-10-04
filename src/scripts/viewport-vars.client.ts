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
  root.style.setProperty('--hero-media-fit', useCover ? 'cover' : 'contain');

  frame?.setAttribute('data-fit', useCover ? 'cover' : 'contain');
}

function setViewportVars() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const headerHeight = measureHeaderHeight();
  const mediaHeight = Math.max(0, vh - headerHeight);

  root.style.setProperty('--app-vw', `${vw}px`);
  root.style.setProperty('--app-vh', `${vh}px`);
  root.style.setProperty('--app-header-height', `${headerHeight}px`);
  root.style.setProperty('--hero-media-height', `${mediaHeight}px`);

  updateHeroMediaVars(vw, mediaHeight);
}

function init() {
  setViewportVars();

  window.addEventListener('resize', setViewportVars, { passive: true });
  window.addEventListener('orientationchange', setViewportVars);
  window.visualViewport?.addEventListener('resize', setViewportVars);

  const video = document.querySelector<HTMLVideoElement>('[data-hero-video]');
  if (video) {
    if (video.readyState >= 1) setViewportVars();
    video.addEventListener('loadedmetadata', setViewportVars);
  }
}

init();
