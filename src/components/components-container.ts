import { Component, ComponentFactory, Core, IocContainer } from '../core';
import { StyledComponent } from '../decorators';
import { IS_READONLY_TOKEN } from '../tokens';

import { DraftSquare } from './draft-square';

@StyledComponent(`.container { position: relative; }`)
export class ComponentsContainer extends Component {
  constructor(private readonly _iocContainer: IocContainer) {
    super('div', 'container');
    const isReadonly = _iocContainer.get<boolean>(IS_READONLY_TOKEN);

    if (!isReadonly) {
      this.element.addEventListener('mousedown', this._drag);
    }
  }

  public override destroy(): void {
    this.element.removeEventListener('mousedown', this._drag);
    super.destroy();
  }

  private _drag = (mousedownEvt: MouseEvent): void => {
    mousedownEvt.stopPropagation();
    const componentFactory = this._iocContainer.get(ComponentFactory);
    const draftSquare = componentFactory.create(DraftSquare, this._iocContainer).appendTo(this);

    let elementRect = this.element.getBoundingClientRect();

    const mousedownX = mousedownEvt.clientX - elementRect.left;
    const mousedownY = mousedownEvt.clientY - elementRect.top;

    draftSquare.draw(mousedownX, mousedownY, mousedownX, mousedownY);

    const mousemove = (mousemoveEvt: MouseEvent): void => {
      mousemoveEvt.preventDefault();
      elementRect = this.element.getBoundingClientRect();

      /* px, e.g 234,23522 */
      let mousemoveX = mousemoveEvt.clientX - elementRect.left;

      if (mousemoveX < 0) {
        mousemoveX = 0;
      }

      if (mousemoveX > elementRect.width) {
        mousemoveX = elementRect.width;
      }

      /* px, e.g 234,23522 */
      let mousemoveY = mousemoveEvt.clientY - elementRect.top;

      if (mousemoveY < 0) {
        mousemoveY = 0;
      }

      if (mousemoveY > elementRect.height) {
        mousemoveY = elementRect.height;
      }

      draftSquare.draw(mousedownX, mousedownY, mousemoveX, mousemoveY);
    };

    const mouseup = (): void => {
      window.removeEventListener('mousemove', mousemove);
      window.removeEventListener('mouseup', mouseup);
      window.removeEventListener('blur', mouseup);

      if (draftSquare.isValid) {
        const core = this._iocContainer.get(Core);
        core.addItem(draftSquare.position);
      }

      draftSquare.destroy();
    };

    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);
    window.addEventListener('blur', mouseup);
  };
}
