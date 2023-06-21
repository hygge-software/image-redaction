import { Position } from '~/models';

export const extractPosition = (style: CSSStyleDeclaration): Position => {
  const { left, top, right, bottom } = style;
  return { left, top, right, bottom };
};

export function stopPropagation(evt: Event): void {
  evt.stopPropagation();
}
