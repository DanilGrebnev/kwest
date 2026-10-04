export type NavItem = {
  label: string;
  href: string;
};

const sections = [
  { label: 'О квесте', hash: 'about' },
  { label: 'Атмосфера', hash: 'atmosphere' },
  { label: 'Галерея', hash: 'gallery' },
  { label: 'Отзывы', hash: 'reviews' },
  { label: 'FAQ', hash: 'faq' },
] as const;

/** Home page: in-page anchors. */
export const navigation: NavItem[] = sections.map((item) => ({
  label: item.label,
  href: `#${item.hash}`,
}));

/** Inner pages: point back to home + section. */
export const innerNavigation: NavItem[] = sections.map((item) => ({
  label: item.label,
  href: `/#${item.hash}`,
}));

export function getNavigation(pathname: string): NavItem[] {
  return pathname === '/' || pathname === '' ? navigation : innerNavigation;
}
