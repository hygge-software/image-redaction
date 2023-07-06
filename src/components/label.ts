import { Component, getColorVariable, IocContainer, MatrixManager } from '../core';
import { StyledComponent } from '../decorators';
import { ComponentsMediator, Matrix } from '../models';
import { stopPropagation } from '../utils';
import { Subscription } from '../common';

@StyledComponent(`
  .label {
    position: absolute;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    font-size: 14px;
    display: grid;
    user-select: none;
    place-items: center;
    border: 1px solid rgb(${getColorVariable('PRIMARY')});
    color: rgb(${getColorVariable('TEXT')});
    border-radius: 50%;
    background-color: rgb(${getColorVariable('TEXT_BACKGROUND')});
    font-weight: 700;
    line-height: 1em;
    top: 0;
    left: 50%;
    z-index: 2;
    cursor: pointer;
  }
  
  .label--active {
    background-color: rgb(${getColorVariable('ACCENT')});
    border: 1px solid rgb(${getColorVariable('ACCENT')});
  }
  
  .label--expanded {
    width: 25px;
    height: 25px;
  }
`)
export class Label extends Component {
  private readonly _subscription = new Subscription();

  constructor(
    iocContainer: IocContainer,
    private readonly _componentsMediator: ComponentsMediator,
  ) {
    super('span', 'label');
    this.element.addEventListener('click', this._click);
    this.element.addEventListener('mousedown', stopPropagation); // it haven't to influence a parent elements

    const matrixManager = iocContainer.get(MatrixManager);

    this._setContent(this._createLabelContent(matrixManager.snapshot));

    const subscription = matrixManager.observe(({ matrix }) => {
      this._setContent(this._createLabelContent(matrix));
    });

    this._subscription.add(subscription);
  }

  public set isActivated(value: boolean) {
    this.element.classList.toggle('label--active', value);
  }

  public override destroy(): void {
    this.element.removeEventListener('click', this._click);
    this.element.removeEventListener('mousedown', stopPropagation);
    this._subscription.unsubscribe();
    super.destroy();
  }

  private _setContent(content: string): void {
    content.length > 1
      ? this.element.classList.add('label--expanded')
      : this.element.classList.remove('label--expanded');

    this.element.textContent = content;
  }

  private _click = (evt: MouseEvent): void => {
    evt.stopPropagation();
    this._componentsMediator.toggleIsActivated();
  };

  private _createLabelContent(matrix: Matrix<{ id: string }>): string {
    const index = matrix.findIndex(group =>
      group.some(redaction => redaction.id === this._componentsMediator.id),
    );

    return (index + 1).toString();
  }
}
