function initHeader() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const mobile = document.querySelector<HTMLElement>('[data-mobile-menu]');

  if (!header || !toggle || !mobile) return;

  const links = mobile.querySelectorAll<HTMLAnchorElement>('a');
  const focusable = [toggle, ...links];

  const setScrolled = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };

  const setMenuOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    mobile.classList.toggle('is-open', open);
    document.body.classList.toggle('is-menu-open', open);

    if (open) {
      links[0]?.focus();
    }
  };

  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  toggle.addEventListener('click', () => {
    setMenuOpen(!isOpen());
  });

  links.forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (!isOpen()) return;

    if (event.key === 'Escape') {
      setMenuOpen(false);
      toggle.focus();
      return;
    }

    if (event.key !== 'Tab' || focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  window.addEventListener('scroll', setScrolled, { passive: true });
  setScrolled();
}

initHeader();
