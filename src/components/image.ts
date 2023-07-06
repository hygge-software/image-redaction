import { Component } from '../core';
import { StyledComponent } from '../decorators';

@StyledComponent(`
  img {
    display: block;
    max-width: 100%;
    user-select: none;
    pointer-events: none;
    width: 100%;
  }
`)
export class Image extends Component<HTMLImageElement> {
  constructor(imageSource: string) {
    super('img');
    this.element.src = imageSource;
  }
}
