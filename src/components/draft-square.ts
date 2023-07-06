import { getColorVariable, IocContainer } from '../core';
import { StyledComponent } from '../decorators';
import { ROOT_ELEMENT_TOKEN } from '../tokens';
import { THRESHOLD_SIZE } from '../constants';

import { Square } from './square';

@StyledComponent(`
  .draft-square {
    position: absolute;
    border: 2px dotted rgb(${getColorVariable('PRIMARY')});
    border-radius: 4px;
    background-color: rgb(${getColorVariable('PRIMARY')} / 0.1);
  }
  
  .draft-square--error {
    border: 2px dotted rgb(${getColorVariable('ERROR')});
    background-color: rgb(${getColorVariable('ERROR')} / 0.1);
  }
`)
export class DraftSquare extends Square {
  constructor(iocContainer: IocContainer) {
    const rootElement = iocContainer.get<HTMLElement>(ROOT_ELEMENT_TOKEN);
    super(rootElement, 'draft-square');
  }

  private _isValid = false;

  public get isValid(): boolean {
    return this._isValid;
  }

  public override draw(pointAX: number, pointAY: number, pointBX: number, pointBY: number): void {
    super.draw(pointAX, pointAY, pointBX, pointBY);
    this._validateSize();
  }

  private _validateSize(): void {
    const width = this.element.offsetWidth;
    const height = this.element.offsetHeight;
    const isInvalid = Math.min(width, height) < THRESHOLD_SIZE;

    this._isValid = !isInvalid;
    this.element.classList.toggle('draft-square--error', isInvalid);
  }
}
