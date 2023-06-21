import { Subscription } from './subscription';

export class EventObserver<K, T extends (data: K) => void = (data: K) => void> {
  private _observers: T[] = [];

  public subscribe(fn: T): Subscription {
    this._observers.push(fn);

    return new Subscription(() => {
      this._observers = this._observers.filter(subscriber => subscriber !== fn);
    });
  }

  public broadcast(data: K): void {
    this._observers.forEach(subscriber => subscriber(data));
  }

  public complete(): void {
    this._observers = [];
  }
}
