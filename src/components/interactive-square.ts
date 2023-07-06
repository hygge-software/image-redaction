import { percentageToPx } from '../utils';
import { getColorVariable, IocContainer } from '../core';
import { IS_READONLY_TOKEN, ROOT_ELEMENT_TOKEN } from '../tokens';
import { StyledComponent } from '../decorators';
import { ComponentsMediator } from '../models';

import { Square } from './square';

@StyledComponent(`
  .square {
    position: absolute;
    border: 2px solid rgb(${getColorVariable('PRIMARY')});
    background-color: rgb(${getColorVariable('PRIMARY')} / 0.05);
    border-radius: 4px;
  }
  
  .square--error {
    border: 2px solid rgb(${getColorVariable('ERROR')});
    background-color: rgb(${getColorVariable('ERROR')} / 0.1);
  }
  
  .square--blur {
    border: 2px solid transparent;
    background-color: rgb(${getColorVariable('PRIMARY')});
  }
  
  .square--highlight:not(.square--blur) {
    border: 2px solid rgb(${getColorVariable('PRIMARY')});
  }
  
  .square--highlight.square--blur {
    border: 4px solid rgb(${getColorVariable('ACCENT')});
  }
`)
export class InteractiveSquare extends Square {
  constructor(
    private readonly _iocContainer: IocContainer,
    private readonly _componentsMediator: ComponentsMediator,
  ) {
    const rootElement = _iocContainer.get<HTMLElement>(ROOT_ELEMENT_TOKEN);
    super(rootElement, 'square');
    Object.assign(this.element.style, _componentsMediator.position);
    const isReadonly = _iocContainer.get<boolean>(IS_READONLY_TOKEN);

    if (!isReadonly) {
      this.element.addEventListener('mousedown', this._drag);
    }
  }

  public set isInvalid(value: boolean) {
    this.element.classList.toggle('square--error', value);
  }

  public set isHighlighted(value: boolean) {
    this.element.classList.toggle('square--highlight', value);
  }

  public set isBlurred(value: boolean) {
    this.element.classList.toggle('square--blur', value);
  }

  public override destroy(): void {
    this.element.removeEventListener('mousedown', this._drag);
    super.destroy();
  }

  private _drag = (mousedownEvt: MouseEvent): void => {
    mousedownEvt.stopPropagation();
    const rootElement = this._iocContainer.get<HTMLElement>(ROOT_ELEMENT_TOKEN);

    let rootElementRect = rootElement.getBoundingClientRect();

    const mousedownX = mousedownEvt.pageX - rootElementRect.left;
    const mousedownY = mousedownEvt.pageY - rootElementRect.top;

    /* px, e.g. 234,23 */
    const initialLeft = percentageToPx(this.element.style.left, rootElementRect.width);
    const initialTop = percentageToPx(this.element.style.top, rootElementRect.height);

    const mousemove = (mousemoveEvt: MouseEvent): void => {
      mousemoveEvt.preventDefault();
      rootElementRect = rootElement.getBoundingClientRect();

      const elementWidth = this.element.offsetWidth;
      const elementHeight = this.element.offsetHeight;

      /* px, e.g 234,23522 */
      const mousemoveX = mousemoveEvt.pageX - rootElementRect.left;
      const mousemoveY = mousemoveEvt.pageY - rootElementRect.top;

      const deltaX = mousemoveX - mousedownX;
      const deltaY = mousemoveY - mousedownY;

      let pointAX = initialLeft + deltaX;
      let pointAY = initialTop + deltaY;
      let pointBX = pointAX + elementWidth;
      let pointBY = pointAY + elementHeight;

      if (pointAX < 0) {
        pointAX = 0;
        pointBX = elementWidth;
      }

      if (pointBX > rootElementRect.width) {
        pointBX = rootElementRect.width;
        pointAX = pointBX - elementWidth;
      }

      if (pointAY < 0) {
        pointAY = 0;
        pointBY = elementHeight;
      }

      if (pointBY > rootElementRect.height) {
        pointBY = rootElementRect.height;
        pointAY = pointBY - elementHeight;
      }

      this.draw(pointAX, pointAY, pointBX, pointBY);
    };

    const mouseup = (): void => {
      window.removeEventListener('mousemove', mousemove);
      window.removeEventListener('mouseup', mouseup);
      window.removeEventListener('blur', mouseup);
      this._componentsMediator.position = this.position;
    };

    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);
    window.addEventListener('blur', mouseup);
  };
}
