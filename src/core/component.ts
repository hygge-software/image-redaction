import { isString } from '../utils';
import { Destroyable } from '../models';

export class Component<K extends HTMLElement = HTMLElement> implements Destroyable {
  public readonly element: K;

  protected constructor(elementTag: keyof HTMLElementTagNameMap, classNames?: string | string[]) {
    this.element = document.createElement(elementTag) as K;
    this._setClassNames(classNames);
  }

  public appendTo(target: Component | Pick<HTMLElement | ShadowRoot, 'appendChild'>): this {
    if (target instanceof Component) {
      target.element.appendChild(this.element);
      return this;
    }

    target.appendChild(this.element);
    return this;
  }

  public destroy(): void {
    this.element.remove();
  }

  private _setClassNames(classNames?: string[] | string): void {
    if (!classNames) {
      return;
    }

    if (Array.isArray(classNames)) {
      this.element.classList.add(...classNames);
      return;
    }

    if (isString(classNames)) {
      this.element.classList.add(classNames);
      return;
    }
  }
}
