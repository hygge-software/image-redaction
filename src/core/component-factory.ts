import { StyledComponent } from '../models';

import { StyleConfigurator } from './style-configurator';

export class ComponentFactory {
  constructor(private readonly _styleConfigurator: StyleConfigurator) {
  }

  public create<T extends new (...args: ConstructorParameters<T>) => InstanceType<T>>(
    component: T,
    ...args: ConstructorParameters<T>
  ): InstanceType<T> {
    const instance = new component(...args);

    this._styleConfigurator.handleComponentStyle(instance as InstanceType<T> & StyledComponent);

    return instance;
  }
}
