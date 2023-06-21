import { StyledComponent } from '~/models';

export function StyledComponent(style: string): ClassDecorator {
  return function (constructor): void {
    const prototype = constructor.prototype as StyledComponent;

    prototype.style = style;
  };
}
