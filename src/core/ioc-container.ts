import { Destroyable } from '../models';

export class IocContainer implements Destroyable {
  private _servicesMap = new Map();

  public register<T extends new (...args: ConstructorParameters<T>) => InstanceType<T>>(
    token: T,
    service: InstanceType<T>,
  ): void;
  public register<C>(token: symbol, service: C): void;
  public register<T extends new (...args: ConstructorParameters<T>) => InstanceType<T>, C>(
    token: T | symbol,
    service: InstanceType<T> | C,
  ): void {
    this._servicesMap.set(token, service);
  }

  public get<T>(token: symbol): T;
  public get<T extends new (...args: ConstructorParameters<T>) => InstanceType<T>>(
    token: T,
  ): InstanceType<T>;
  public get<T extends new (...args: ConstructorParameters<T>) => InstanceType<T>>(
    token: T | symbol,
  ): InstanceType<T> {
    return this._servicesMap.get(token);
  }

  public destroy(): void {
    this._servicesMap.clear();
  }
}
