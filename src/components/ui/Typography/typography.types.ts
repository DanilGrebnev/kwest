export type TypographyTag = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';

export type TypographySize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero';

export type TypographyWeight =
  | 'regular'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'black';

export interface TypographyProps {
  as?: TypographyTag;
  size?: TypographySize;
  weight?: TypographyWeight;
  class?: string;
  id?: string;
}
