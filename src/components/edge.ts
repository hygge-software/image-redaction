import { Component, IocContainer } from '~/core';
import { extractPosition, percentageToPx, pxToPercentage } from '~/utils';
import { EDGE_SIDES } from '~/constants';
import { ROOT_ELEMENT_TOKEN } from '~/tokens';
import { StyledComponent } from '~/decorators';
import { ComponentsMediator } from '~/models';

@StyledComponent(`
  .edge {
    position: absolute;
  }
  
  .edge--nw {
    top: 0;
    left: 0;
    width: 5px;
    height: 5px;
    cursor: nwse-resize;
  }

  .edge--n {
    top: 0;
    left: 5px;
    width: calc(100% - 10px);
    height: 5px;
    cursor: ns-resize;
  }

  .edge--ne {
    top: 0;
    right: 0;
    width: 5px;
    height: 5px;
    cursor: nesw-resize;
  }

  .edge--e {
    top: 5px;
    right: 0;
    width: 5px;
    height: calc(100% - 10px);
    cursor: ew-resize;
  }

  .edge--se {
    right: 0;
    bottom: 0;
    width: 5px;
    height: 5px;
    cursor: nwse-resize;
  }

  .edge--s {
    bottom: 0;
    left: 5px;
    width: calc(100% - 10px);
    height: 5px;
    cursor: ns-resize;
  }

  .edge--sw {
    bottom: 0;
    left: 0;
    width: 5px;
    height: 5px;
    cursor: nesw-resize;
  }

  .edge--w {
    top: 5px;
    left: 0;
    width: 5px;
    height: calc(100% - 10px);
    cursor: ew-resize;
  }
`)
export class Edge extends Component {
  constructor(
    private readonly _iocContainer: IocContainer,
    private readonly _parentElement: HTMLElement,
    private readonly _side: (typeof EDGE_SIDES)[number],
    private readonly _componentsMediator: ComponentsMediator,
  ) {
    super('span', ['edge', `edge--${_side}`]);
    this.element.addEventListener('mousedown', this._resize);
  }

  public override destroy(): void {
    this.element.removeEventListener('mousedown', this._resize);
    super.destroy();
  }

  private _resize = (mousedownEvt: MouseEvent): void => {
    mousedownEvt.stopPropagation();
    const initialPosition = extractPosition(this._parentElement.style);
    const { oppositeX, oppositeY } = this._getOppositeCoords();

    const mousemove = (mousemoveEvt: MouseEvent): void => {
      mousemoveEvt.preventDefault();
      const rootElement = this._iocContainer.get<HTMLDivElement>(ROOT_ELEMENT_TOKEN);
      const rootElementRect = rootElement.getBoundingClientRect();

      /* px, e.g. 234.23522 */
      let mousemoveX = mousemoveEvt.pageX - rootElementRect.left;

      if (mousemoveX < 0) {
        mousemoveX = 0;
      }

      if (mousemoveX > rootElementRect.width) {
        mousemoveX = rootElementRect.width;
      }

      /* px, e.g. 234.23522 */
      let mousemoveY = mousemoveEvt.pageY - rootElementRect.top;

      if (mousemoveY < 0) {
        mousemoveY = 0;
      }

      if (mousemoveY > rootElementRect.height) {
        mousemoveY = rootElementRect.height;
      }

      if (!isNaN(oppositeX!)) {
        /* px, e.g 234.23522 */
        const left = Math.min(oppositeX!, mousemoveX);
        const right = rootElementRect.width - Math.max(mousemoveX, oppositeX!);

        this._parentElement.style.left = pxToPercentage(left, rootElementRect.width) + '%';
        this._parentElement.style.right = pxToPercentage(right, rootElementRect.width) + '%';
      }

      if (!isNaN(oppositeY!)) {
        /* px, e.g 234.23522 */
        const top = Math.min(oppositeY!, mousemoveY);
        const bottom = rootElementRect.height - Math.max(mousemoveY, oppositeY!);

        this._parentElement.style.top = pxToPercentage(top, rootElementRect.height) + '%';
        this._parentElement.style.bottom = pxToPercentage(bottom, rootElementRect.height) + '%';
      }

      this._componentsMediator.validateSize();
    };

    const mouseup = (): void => {
      window.removeEventListener('mousemove', mousemove);
      window.removeEventListener('mouseup', mouseup);
      window.removeEventListener('blur', mouseup);

      if (this._componentsMediator.isInvalid) {
        Object.assign(this._parentElement.style, initialPosition);
        this._componentsMediator.validateSize();
        return;
      }

      this._componentsMediator.position = extractPosition(this._parentElement.style);
    };

    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);
    window.addEventListener('blur', mouseup);
  };

  private _getOppositeCoords(): Partial<Record<'oppositeX' | 'oppositeY', number>> {
    const rootElement = this._iocContainer.get<HTMLDivElement>(ROOT_ELEMENT_TOKEN);
    const rootElementWidth = rootElement.offsetWidth;
    const rootElementHeight = rootElement.offsetHeight;

    const squarePosition = extractPosition(this._parentElement.style);
    const bottom = percentageToPx(squarePosition.bottom, rootElementHeight);
    const left = percentageToPx(squarePosition.left, rootElementWidth);
    const top = percentageToPx(squarePosition.top, rootElementHeight);
    const right = percentageToPx(squarePosition.right, rootElementWidth);

    switch (this._side) {
      case 'n':
        return { oppositeY: rootElementHeight - bottom };

      case 'ne':
        return { oppositeX: left, oppositeY: rootElementHeight - bottom };

      case 'e':
        return { oppositeX: left };

      case 'se':
        return { oppositeX: left, oppositeY: top };

      case 's':
        return { oppositeY: top };

      case 'sw':
        return { oppositeY: top, oppositeX: rootElementWidth - right };

      case 'w':
        return { oppositeX: rootElementWidth - right };

      case 'nw':
        return { oppositeX: rootElementWidth - right, oppositeY: rootElementHeight - bottom };
    }
  }
}
