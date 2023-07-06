import { StyledComponent } from '../models';

const INITIAL_STYLE = `
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
`;

export class StyleConfigurator {
  private readonly _alreadyStyledComponents = new WeakSet<StyledComponent>();

  constructor(private readonly _shadowRoot: ShadowRoot) {
    this._setStyle(INITIAL_STYLE);
  }

  public handleComponentStyle(component: StyledComponent): void {
    if (this._alreadyStyledComponents.has(component.constructor.prototype)) {
      return;
    }

    this._setStyle(component.style);
    this._alreadyStyledComponents.add(component.constructor.prototype);
  }

  private _setStyle(style: string): void {
    const element = document.createElement('style');
    element.textContent = style;

    this._shadowRoot.insertBefore(element, this._shadowRoot.firstChild);
  }
}
