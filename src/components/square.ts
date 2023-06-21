import { Component } from '~/core';
import { extractPosition, pxToPercentage } from '~/utils';
import { Position } from '~/models';

export class Square extends Component {
  constructor(protected readonly rootElement: HTMLElement, classNames: string | string[]) {
    super('span', classNames);
  }

  public get position(): Position {
    return extractPosition(this.element.style);
  }

  protected draw(pointAX: number, pointAY: number, pointBX: number, pointBY: number): void {
    const rootElementWidth = this.rootElement.offsetWidth;
    const rootElementHeight = this.rootElement.offsetHeight;

    const left = Math.min(pointAX, pointBX);
    const right = rootElementWidth - Math.max(pointAX, pointBX);

    const top = Math.min(pointAY, pointBY);
    const bottom = rootElementHeight - Math.max(pointAY, pointBY);

    Object.assign(this.element.style, {
      left: pxToPercentage(left, rootElementWidth) + '%',
      right: pxToPercentage(right, rootElementWidth) + '%',
      top: pxToPercentage(top, rootElementHeight) + '%',
      bottom: pxToPercentage(bottom, rootElementHeight) + '%',
    });
  }
}
