function initReviewsToggle() {
  const toggle = document.querySelector<HTMLButtonElement>('[data-reviews-toggle]');
  const more = document.querySelector<HTMLElement>('[data-reviews-more]');

  if (!toggle || !more) return;

  const setOpen = (open: boolean) => {
    more.setAttribute('data-open', open ? 'true' : 'false');
    toggle.textContent = open ? 'Свернуть отзывы' : 'Посмотреть все отзывы';
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  toggle.addEventListener('click', () => {
    const open = more.getAttribute('data-open') !== 'true';
    setOpen(open);
    if (open) {
      more.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initReviewsToggle, { once: true });
} else {
  initReviewsToggle();
}
